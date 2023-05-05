# Server initialization file

import yaml


class Config:
    """
    This class maps config.yaml to python.
    """

    # Creates config field for each configuration in config.yaml
    def __init__(self, yaml_config_path: str = "config.yaml"):
        self.yaml_config_path = yaml_config_path
        self.config_dict = yaml.safe_load(open(self.yaml_config_path))

        for config in self.config_dict:
            for sub_config, value in self.config_dict[config].items():
                setattr(self, sub_config, value)

    def get(self, config_field: str):
        """
        This function returns the value of the config field.
        If the config field is not found, it will throw an error.
        @param config_field: The name of the config field.
        All the fields are listed in self.config_dict.
        """
        return getattr(self, config_field)


# Object that holds all the configuration values from config.yaml
CONFIG = Config()
