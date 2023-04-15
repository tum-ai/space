from sqlalchemy.ext.declarative import declarative_base

# don't touch this base class!
Base = declarative_base()


class MixinAsDict:
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
