import abc
from dataclasses import dataclass, asdict
from typing import List, Dict, Any


@dataclass
class ProductOutput:
    id: str
    raw_id: Any
    title: str
    title_en: str
    description: str
    provider: str
    provider_code: str
    price: int
    rrp_price: int
    price_toman: int
    rrp_price_toman: int
    offer: float
    is_in_stock: bool
    image_url: str
    link: str

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        d['title_fa'] = self.title
        d['store_name'] = self.provider
        d['store_code'] = self.provider_code
        d['price_selling'] = self.price
        d['price_selling_toman'] = self.price_toman
        d['discount_percent'] = self.offer
        d['product_url'] = self.link
        return d


class BaseScraper(abc.ABC):
    provider_name: str = "Base"
    provider_code: str = "base"

    def __init__(self):
        self._data: List[ProductOutput] = []
        self._total_items: int = 0
        self._total_pages: int = 1

    @abc.abstractmethod
    def scrap(self, raw_data: Any) -> List[ProductOutput]:
        pass

    @abc.abstractmethod
    def search(self, query: str, page: int = 1) -> List[ProductOutput]:
        pass

    @property
    def output(self) -> List[ProductOutput]:
        return self._data

    @property
    def total_items(self) -> int:
        return self._total_items

    @property
    def total_pages(self) -> int:
        return self._total_pages
