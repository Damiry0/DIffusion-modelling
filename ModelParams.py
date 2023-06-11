from typing import Optional, Tuple, Dict, Any

import pydantic
from pydantic import BaseModel


class ModelParams(BaseModel):
    data: object
    initial_fraction: float
    iterations: int
    q: int
    i: float
    b_min: float
    b_max: float
    t_min: float
    t_max: float
    r_negative: float
    r_neutral: float
    r_positive: float
    epsilon: float
    gamma: float


class AllOptional(pydantic.main.ModelMetaclass):
    def __new__(self, name: str, bases: Tuple[type], namespaces: Dict[str, Any], **kwargs):
        annotations: dict = namespaces.get('__annotations__', {})
        for base in bases:
            for base_ in base.__mro__:
                if base_ is BaseModel:
                    break
                annotations.update(base_.__annotations__)
        for field in annotations:
            if not field.startswith('__'):
                annotations[field] = Optional[annotations[field]]
        namespaces['__annotations__'] = annotations
        return super().__new__(self, name, bases, namespaces, **kwargs)


class UpdatedModelParams(ModelParams, metaclass=AllOptional):
    pass
