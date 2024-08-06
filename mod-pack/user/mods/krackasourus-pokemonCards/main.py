from bundles.generate_bundles import generate_bundles
from config.generate_card_configs import generate_card_configs
from config.generate_binder_configs import generate_binder_configs
from config.generate_pack_configs import generate_pack_configs

def main():
    generate_bundles()
    _, cards_by_rarity = generate_card_configs()
    generate_binder_configs()
    generate_pack_configs(cards_by_rarity)

if __name__ == "__main__":
    main()