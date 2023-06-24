from pathlib import (
    Path,
)

import yaml
from dotenv import (
    load_dotenv,
)

load_dotenv()


ROOT_PATH = Path(__file__).parent.parent.parent.parent


class Config:
    """
    This class maps config.yaml to python.
    """

    # Creates config field for each configuration in config.yaml
    def __init__(self) -> None:
        self.yaml_config_path = ROOT_PATH / "api" / "config.yaml"
        self.config_dict = yaml.safe_load(open(self.yaml_config_path))

        for config in self.config_dict:
            for sub_config, value in self.config_dict[config].items():
                setattr(self, sub_config, value)

    def get(self, config_field: str) -> str:
        """
        This function returns the value of the config field.
        If the config field is not found, it will throw an error.
        @param config_field: The name of the config field.
        All the fields are listed in self.config_dict.
        """
        return getattr(self, config_field)


# holds all the configuration values from config.yaml
CONFIG = Config()
