from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Any
from tracker.services.digikala import DigikalaScraper
from tracker.services.technolife import TechnolifeScraper


class MultiStoreAggregator:
    SCRAPERS = [
        DigikalaScraper,
        TechnolifeScraper,
    ]

    @classmethod
    def search_all(cls, query: str, page: int = 1) -> dict:
        all_products: List[Dict[str, Any]] = []
        total_items = 0
        total_pages = 1
        errors = []
        seen_ids = set()

        def run_scraper(scraper_cls):
            instance = scraper_cls()
            products = instance.search(query, page)
            return instance, products

        with ThreadPoolExecutor(max_workers=len(cls.SCRAPERS) or 1) as executor:
            futures = [executor.submit(run_scraper, scraper_cls) for scraper_cls in cls.SCRAPERS]

            for future in as_completed(futures):
                try:
                    instance, products = future.result()
                    for p in products:
                        p_dict = p.to_dict()
                        p_id = p_dict.get("id")
                        if p_id and p_id not in seen_ids:
                            seen_ids.add(p_id)
                            all_products.append(p_dict)

                    total_items += instance.total_items
                    if instance.total_pages > total_pages:
                        total_pages = instance.total_pages
                except Exception as exc:
                    errors.append(str(exc))

        return {
            "success": len(all_products) > 0 or len(errors) == 0,
            "products": all_products,
            "total_items": total_items,
            "total_pages": total_pages,
            "errors": errors
        }
