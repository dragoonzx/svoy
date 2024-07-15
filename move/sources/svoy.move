/// SvoyDad initialize Svoy Collection
/// Who can mint Svoy Token => Everybody
/// When social lvl is updated => When you have new connection added (dont need to have social lvl, just count connections)
/// Kudos => everybody can pay kudos to Svoy token holder. Token holder cant withdraw their tokens, only raffle it
/// 
/// Token has property maps (traits of the token) & custom attributes
/// SvoyToken { base_uri: String, name: String,  SvoyConnections: vector<address>, social_lvl: 'newbie' | 'pro' | 'expert' | 'gigachad', Kudos: NativeTokens, Raffles: vector<SvoyRaffle> }
/// SvoyRaffle { start_timestamp, end_timestamp, award, winner }
/// URI of token: base_uri + name + social_lvl + connections
module svoy_mom_v0::svoy_v0 {
    use std::error;
    use std::option;
    use std::string::{Self, String};
    use std::signer;
    use std::vector;

    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::object::{Self, Object};
    use aptos_framework::account::SignerCapability;
    use aptos_framework::resource_account;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::randomness;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_token_objects::property_map;
    use aptos_std::string_utils::{to_string};

    const ETOKEN_DOES_NOT_EXIST: u64 = 1;
    const ENOT_OWNER: u64 = 2;
    const EFIELD_NOT_MUTABLE: u64 = 3;
    const ETOKEN_NOT_BURNABLE: u64 = 4;
    const EPROPERTIES_NOT_MUTABLE: u64 = 5;
    const ECOLLECTION_DOES_NOT_EXIST: u64 = 6;

    /// The Svoy token collection name
    const COLLECTION_NAME: vector<u8> = b"Svoy Profiles";
    /// The Svoy token collection description
    const COLLECTION_DESCRIPTION: vector<u8> = b"Svoy - business card`s of the future";
    /// The Svoy token collection URI
    const COLLECTION_URI: vector<u8> = b"https://svoy-eta.vercel.app/";

    const PROP_SOCIAL_LVL: vector<u8> = b"social_lvl";

    const SOCIAL_NEWBIE: vector<u8> = b"Newbie";
    const SOCIAL_PRO: vector<u8> = b"Pro";
    const SOCIAL_EXPERT: vector<u8> = b"Expert";
    const SOCIAL_GIGACHAD: vector<u8> = b"Gigachad";

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct ModuleData has key {
        signer_cap: SignerCapability,
        whitelist: vector<address>,
        only_whitelist: bool,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct SvoyToken has key {
        mutator_ref: token::MutatorRef,
        burn_ref: token::BurnRef,
        property_mutator_ref: property_map::MutatorRef,
        base_uri: String,
        name: String,
        description: String,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Connections has key {
        connections: vector<address>,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Kudos has key {
        coins: Coin<AptosCoin>,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct SocialLinks has key {
        title: String,
        href: String,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct ShowcaseNFT has key {
        pfp_url: String,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Raffle has key {
        start_timestamp: u64,
        end_timestamp: u64,
        award: Coin<AptosCoin>,
        description: String,
        tickets: vector<address>,
        winner: address,
        is_claimed: bool,
    }

    #[event]
    /// Generate diffs on client
    struct ConnectionsUpdate has drop, store {
        token: Object<SvoyToken>,
        old_connections: vector<address>,
        new_connections: vector<address>,
    }

    fun init_module(sender: &signer) {
        create_svoy_collection(sender);
        let resource_signer_cap = resource_account::retrieve_resource_account_cap(sender, @source);
        move_to(sender, ModuleData {
            signer_cap: resource_signer_cap,
            whitelist: vector[],
            only_whitelist: false,
        });
    }

    #[view]
    public fun connections(token: address): vector<address> acquires Connections {
        let connections = borrow_global<Connections>(token);
        connections.connections
    }

    #[view]
    public fun get_social_links(token: address): vector<String> acquires SocialLinks {
        let social_links = borrow_global<SocialLinks>(token);
        let links = vector[];
        vector::push_back(&mut links, social_links.title);
        vector::push_back(&mut links, social_links.href);
        links
    }

    #[view]
    public fun get_showcase_nft_url(token: address): String acquires ShowcaseNFT {
        let showcase_nft = borrow_global<ShowcaseNFT>(token);
        showcase_nft.pfp_url
    }


    #[view]
    public fun get_last_raffle_winner(token: address): address acquires Raffle {
        let raffle = borrow_global<Raffle>(token);
        raffle.winner
    }

    #[view]
    public fun get_last_raffle_end_timestamp(token: address): u64 acquires Raffle {
        let raffle = borrow_global<Raffle>(token);
        raffle.end_timestamp
    }

    #[view]
    public fun get_last_raffle_description(token: address): String acquires Raffle {
        let raffle = borrow_global<Raffle>(token);
        raffle.description
    }

    #[view]
    public fun kudos_amount(token: address): u64 acquires Kudos {
        let kudos = borrow_global<Kudos>(token);
        coin::value(&kudos.coins)
    }

    #[view]
    public fun social_lvl(token: Object<SvoyToken>): String {
        property_map::read_string(&token, &string::utf8(PROP_SOCIAL_LVL))
    }

    #[view]
    public fun social_lvl_from_address(addr: address): String {
        let token = object::address_to_object<SvoyToken>(addr);
        social_lvl(token)
    }

    fun create_svoy_collection(resource_signer: &signer) {
        let description = string::utf8(COLLECTION_DESCRIPTION);
        let name = string::utf8(COLLECTION_NAME);
        let uri = string::utf8(COLLECTION_URI);

        collection::create_unlimited_collection(
            resource_signer,
            description,
            name,
            option::none(),
            uri,
        );
    }

    // acquires ModuleData
    public entry fun mint_svoy_token(
        // resource_signer: &signer,
        name: String,
        description: String,
        uri: String,
        user_addr: address
    ) acquires ModuleData {
        // todo check that user doesnt have already
        mint_svoy_token_impl(description, name, uri, user_addr);
    }

    // acquires ModuleData
    fun mint_svoy_token_impl(
        // resource_signer: &signer,
        description: String,
        name: String,
        base_uri: String,
        soul_bound_to: address,
    ) acquires ModuleData {
        let module_data = borrow_global_mut<ModuleData>(@svoy_mom_v0);
        let resource_signer = aptos_framework::account::create_signer_with_capability(&module_data.signer_cap);

        let collection = string::utf8(COLLECTION_NAME);

        let uri = modify_uri_string(base_uri, name, string::utf8(b""), 0);

        let constructor_ref = token::create_named_token(
            &resource_signer,
            collection,
            description,
            name,
            option::none(),
            uri,
        );
        
        let object_signer = object::generate_signer(&constructor_ref);
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        let mutator_ref = token::generate_mutator_ref(&constructor_ref);
        let burn_ref = token::generate_burn_ref(&constructor_ref);
        let property_mutator_ref = property_map::generate_mutator_ref(&constructor_ref);

        // Transfers the token to the `soul_bound_to` address
        let linear_transfer_ref = object::generate_linear_transfer_ref(&transfer_ref);
        object::transfer_with_ref(linear_transfer_ref, soul_bound_to);

        // Disables ungated transfer, thus making the token soulbound and non-transferable
        object::disable_ungated_transfer(&transfer_ref);

        move_to(&object_signer, Connections { connections: vector[] });
        move_to(&object_signer, Kudos { coins: coin::zero<AptosCoin>() });
        move_to(&object_signer, ShowcaseNFT { pfp_url: string::utf8(b"") });
        move_to(&object_signer, SocialLinks {
            title: string::utf8(b""),
            href: string::utf8(b""),
        });
        move_to(&object_signer, Raffle {
            start_timestamp: 0,
            end_timestamp: 0,
            award: coin::zero<AptosCoin>(),
            description:  string::utf8(b""),
            winner: @0x0,
            is_claimed: false,
            tickets: vector[],
         });

        let properties = property_map::prepare_input(vector[], vector[], vector[]);
        property_map::init(&constructor_ref, properties);
        property_map::add_typed(
            &property_mutator_ref,
            string::utf8(PROP_SOCIAL_LVL),
            string::utf8(SOCIAL_NEWBIE)
        );

        // Publishes the SvoyToken resource with the refs.
        let svoy_token = SvoyToken {
            mutator_ref,
            burn_ref,
            property_mutator_ref,
            base_uri,
            name,
            description
        };
        move_to(&object_signer, svoy_token);
    }

    public entry fun burn(user: &signer, token: address) acquires SvoyToken, Connections {
        authorize_owner(user, token);

        let ambassador_token = move_from<SvoyToken>(token);
        let SvoyToken {
            mutator_ref: _,
            burn_ref,
            property_mutator_ref,
            base_uri: _,
            name: _,
            description: _
        } = ambassador_token;

        let Connections {
            connections: _
        } = move_from<Connections>(token);
        // let Kudos {
        //     coins: _
        // } = move_from<Kudos>(object::object_address(&token));
        // let Raffles {
        //     raffles: _
        // } = move_from<Raffles>(object::object_address(&token));


        property_map::burn(property_mutator_ref);
        token::burn(burn_ref);
    }

    /// (!) For sake of MVP new connection added only to those who have invite
    public entry fun update_svoy_connections(
        user: &signer,
        token: address,
        new_connection: address
    ) acquires Connections, SvoyToken {
        authorize_owner(user, token);

        let token_address = token;
        let connections = borrow_global_mut<Connections>(token_address);

        let new_connections = vector::empty<address>();
        vector::append(&mut new_connections, connections.connections);
        vector::push_back(&mut new_connections, new_connection);

        // event::emit(
        //     ConnectionsUpdate {
        //         token,
        //         old_connections: connections.connections,
        //         new_connections: new_connections,
        //     }
        // );
        connections.connections = new_connections;
        update_social_lvl(token, new_connections);
    }

    public entry fun give_kudos_in_apt(
        user: &signer,
        receiver_token: address,
        amount: u64
    ) acquires Kudos, Raffle {
        let token_address = receiver_token;
        let kudos = borrow_global_mut<Kudos>(token_address);
        let coins = coin::withdraw<AptosCoin>(user, amount);
        coin::merge<AptosCoin>(&mut kudos.coins, coins);

        let raffle = borrow_global_mut<Raffle>(token_address);
        vector::push_back(&mut raffle.tickets, signer::address_of(user));
    }

    public entry fun set_social_links(
        user: &signer,
        token: address,
        title: String,
        href: String
    ) acquires SocialLinks {
        authorize_owner(user, token);

        let token_address = token;
        let social_links = borrow_global_mut<SocialLinks>(token_address);

        social_links.title = title;
        social_links.href = href;
    }

    public entry fun set_showcase_nft(
        user: &signer,
        token: address,
        url: String
    ) acquires ShowcaseNFT {
        authorize_owner(user, token);

        let token_address = token;
        let showcase_nft = borrow_global_mut<ShowcaseNFT>(token_address);

        showcase_nft.pfp_url = url;
    }

    public entry fun create_raffle(
        user: &signer,
        token: address,
        description: String,
        end_timestamp: u64
    ) acquires Kudos, Raffle {
        authorize_owner(user, token);

        let token_address = token;
        let kudos = borrow_global_mut<Kudos>(token_address);

        let coins = coin::extract_all<AptosCoin>(&mut kudos.coins);

        let raffle = borrow_global_mut<Raffle>(token_address);
        raffle.start_timestamp =  aptos_framework::timestamp::now_microseconds();
        // in ms
        raffle.end_timestamp = end_timestamp;
        coin::merge<AptosCoin>(&mut raffle.award, coins);
        raffle.description = description;
        raffle.winner = @0x0;
        raffle.is_claimed = false;
    }

    #[randomness]
    entry fun raffle_winner_and_transfer(
        token: address
    ) acquires Raffle {
        raffle_winner_and_transfer_internal(token);
    }

    fun raffle_winner_and_transfer_internal(
        token: address
    ): address acquires Raffle {
        let token_address = token;
        let raffle = borrow_global_mut<Raffle>(token_address);
        assert!(aptos_framework::timestamp::now_microseconds() > raffle.end_timestamp, 777);
        assert!(!raffle.is_claimed, 1000);
        assert!(!vector::is_empty(&raffle.tickets), 75);

        let winner_idx = randomness::u64_range(0, vector::length(&raffle.tickets));
        let winner = *vector::borrow(&raffle.tickets, winner_idx);

        let coins = coin::extract_all(&mut raffle.award);
        coin::deposit<AptosCoin>(winner, coins);
        raffle.is_claimed = true;
        raffle.winner = winner;

        winner
    }

    fun update_social_lvl(
        token: address,
        new_connections: vector<address>
    ) acquires SvoyToken {
        let connections_count = vector::length(&new_connections);
        let social_lvl = if (connections_count < 2) {
            SOCIAL_NEWBIE
        } else if (connections_count < 5) {
            SOCIAL_PRO
        } else if (connections_count < 20) {
            SOCIAL_EXPERT
        } else {
            SOCIAL_GIGACHAD
        };

        let token_address = token;
        let svoy_token = borrow_global<SvoyToken>(token_address);
        let property_mutator_ref = &svoy_token.property_mutator_ref;

        property_map::update_typed(property_mutator_ref, &string::utf8(PROP_SOCIAL_LVL), string::utf8(social_lvl));
        let uri = modify_uri_string(svoy_token.base_uri, svoy_token.name, string::utf8(social_lvl), connections_count);
        token::set_uri(&svoy_token.mutator_ref, uri);
    }

    /// URI of token: base_uri + name + social_lvl
    fun modify_uri_string(
        base_uri: String,
        name: String,
        social_lvl: String,
        connections_count: u64
    ): String {
        let uri = base_uri;
        string::append(&mut uri, string::utf8(b"?name="));
        string::append(&mut uri, name);
        string::append(&mut uri, string::utf8(b"&social_lvl="));
        string::append(&mut uri, social_lvl);
        string::append(&mut uri, string::utf8(b"&connections_count="));
        string::append(&mut uri, to_string(&connections_count));
        uri
    }

    inline fun authorize_owner(owner: &signer, token_address: address) {
        let token = object::address_to_object<SvoyToken>(token_address);
        assert!(
            exists<SvoyToken>(token_address),
            error::not_found(ETOKEN_DOES_NOT_EXIST),
        );
        assert!(
            object::owner(token) == signer::address_of(owner),
            error::permission_denied(ENOT_OWNER),
        );
    }


    #[test_only]
    use aptos_framework::coin::BurnCapability;
    #[test_only]
    use aptos_framework::account::create_account_for_test;
     #[test_only]
    use aptos_std::crypto_algebra::enable_cryptography_algebra_natives;

    #[test_only]
    public fun set_up_test(origin_account: &signer, resource_acc: &signer, aptos_framework: &signer, user2: &signer): BurnCapability<AptosCoin> {
        aptos_framework::timestamp::set_time_has_started_for_testing(aptos_framework);

        create_account_for_test(signer::address_of(origin_account));
        // create_account_for_test(signer::address_of(resource_acc));

        // create a resource account from the origin account, mocking the module publishing process
        // resource_account::create_resource_account(origin_account, vector::empty<u8>(), vector::empty<u8>());

        create_account_for_test(signer::address_of(user2));
        init_module(origin_account);
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<AptosCoin>(
            aptos_framework,
            string::utf8(b"TC"),
            string::utf8(b"TC"),
            8,
            false,
        );
        coin::register<AptosCoin>(user2);
        let coins = coin::mint<AptosCoin>(2000, &mint_cap);
        coin::deposit(signer::address_of(user2), coins);
        coin::destroy_mint_cap(mint_cap);
        coin::destroy_freeze_cap(freeze_cap);

        burn_cap
    }

    // NOTE!: tests currently dont work because of using resource accounts
    #[test(aptos_framework = @0x1, creator = @source, resource_acc = @svoy_mom_v0, user1 = @0x456, user2 = @0x789)]
    fun test_happy_path(aptos_framework: &signer, creator: signer, resource_acc: signer, user1: &signer, user2: &signer) acquires SvoyToken, Connections, Kudos, Raffle, ShowcaseNFT {
        let burn_cap = set_up_test(&creator, &resource_acc, aptos_framework, user2);

        let token_name = string::utf8(b"Max S");
        let token_description = string::utf8(b"I <3 Aptos");
        let token_uri = string::utf8(b"todo token uri");

        let user1_addr = signer::address_of(user1);
        let user2_addr = signer::address_of(user2);

        let creator_addr = signer::address_of(&creator);
        std::debug::print(&user1_addr);
        mint_svoy_token(
            // &creator,
            token_name,
            token_description,
            token_uri,
            user1_addr
        );
        let token_name2 = string::utf8(b"Fake Max S");
        mint_svoy_token(
            // &creator,
            token_name2,
            token_description,
            token_uri,
            user2_addr
        );
        let collection_name = string::utf8(COLLECTION_NAME);
        let token_address1 = token::create_token_address(
            &creator_addr,
            &collection_name,
            &token_name
        );

        let token_address2 = token::create_token_address(
            &creator_addr,
            &collection_name,
            &token_name2
        );
        
        
        let token1 = token_address1;
        // assert!(object::owner(token1) == user1_addr, 1);

        let token2 = token_address2;

        update_svoy_connections(user1, token1, user2_addr);

        assert!(vector::length(&connections(token1)) == 1, 3);

        assert!(social_lvl_from_address(token1) == string::utf8(SOCIAL_NEWBIE), 2);

        let token1_addr = token1;
        assert!(exists<SvoyToken>(token1_addr), 6);

        // give kudos
        give_kudos_in_apt(
            user2,
            token1,
            500
        );

        assert!(coin::balance<AptosCoin>(user2_addr) == 1500, 321);
        assert!(kudos_amount(token1) == 500, 322);

        // raffle
        enable_cryptography_algebra_natives(aptos_framework);
        randomness::initialize_for_testing(aptos_framework);
        create_raffle(user1, token1, string::utf8(b"Sub to my X profile"), aptos_framework::timestamp::now_microseconds());
        aptos_framework::timestamp::fast_forward_seconds(500);
        assert!(get_last_raffle_winner(token1) == @0x0, 500);
        let winner = raffle_winner_and_transfer_internal(token1);
        std::debug::print(&winner);

        assert!(get_last_raffle_winner(token1) == user2_addr, 501);
        assert!(coin::balance<AptosCoin>(user2_addr) == 2000, 502);
        assert!(kudos_amount(token1) == 0, 322);

        let favorite_nft_pfp_url = string::utf8(b"https://mypfp.com/image.png");
        // showcase nft
        set_showcase_nft(
            user1,
            token1,
            favorite_nft_pfp_url
        );
        assert!(get_showcase_nft_url(token1) == favorite_nft_pfp_url, 1454);

        set_showcase_nft(
            user2,
            token2,
            favorite_nft_pfp_url
        );
        assert!(get_showcase_nft_url(token2) == favorite_nft_pfp_url, 1454);

        burn(user1, token1);
        burn(user2, token2);
        assert!(!exists<SvoyToken>(token1_addr), 7);
        coin::destroy_burn_cap(burn_cap);
    }

    // #[test(creator = @0x123, user1 = @0x456)]
    // fun test_mint_connections_burn(creator: &signer, user1: &signer) {
    //     create_svoy_collection(creator);

    //     let token_name = string::utf8(b"Max S");
    //     let token_description = string::utf8(b"I <3 Aptos");
    //     let token_uri = string::utf8(b"todo token uri");
    //     let user1_addr = signer::address_of(user1);
    //     mint_svoy_token(
    //         creator,
    //         token_name,
    //         token_description,
    //         token_uri,
    //         user1_addr
    //     );
    //     let collection_name = string::utf8(COLLECTION_NAME);
    //     let token_address = token::create_token_address(
    //         &user1_addr,
    //         &collection_name,
    //         &token_name
    //     );
    //     let token = object::address_to_object<SvoyToken>(token_address);
    //     assert!(object::owner(token) == user1_addr, 1);
    // }

//         assert!(social_lvl(token) == string::utf8(SOCIAL_NEWBIE), 2);

//         update_svoy_connections(user1, token, @0x1);

//         assert!(vector::length(&connections(token)) == 1, 3);

//         let i = 0;
//         loop {
//             i = i + 1;
//             update_svoy_connections(user1, token, @0x1);
//             if (i > 10) break;
//         };

//         assert!(social_lvl(token) == string::utf8(SOCIAL_EXPERT), 2);

//         let token_addr = object::object_address(&token);
//         assert!(exists<SvoyToken>(token_addr), 6);
//         burn(user1, token);
//         assert!(!exists<SvoyToken>(token_addr), 7);
//     }
}
