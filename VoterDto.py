from pydantic import BaseModel


class Item(BaseModel):
    data: object
    initial_fraction: float
    iterations: int