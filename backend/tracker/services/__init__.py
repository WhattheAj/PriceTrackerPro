from tracker.services.base import BaseScraper, ProductOutput
from tracker.services.digikala import DigikalaScraper
from tracker.services.technolife import TechnolifeScraper
from tracker.services.aggregator import MultiStoreAggregator

__all__ = [
    'BaseScraper',
    'ProductOutput',
    'DigikalaScraper',
    'TechnolifeScraper',
    'MultiStoreAggregator',
]
