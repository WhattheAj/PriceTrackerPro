import json
import requests
from typing import List, Any
from lxml import html
from tracker.services.base import BaseScraper, ProductOutput


class TechnolifeScraper(BaseScraper):
    provider_name = "تکنولایف"
    provider_code = "technolife"
    BASE_URL = "https://www.technolife.ir/product/list/search"

    def scrap(self, raw_data: Any) -> List[ProductOutput]:
        products: List[ProductOutput] = []
        
        if not raw_data:
            return products

        try:
            tree = html.fromstring(raw_data)
            script_nodes = tree.xpath('//script[@id="__NEXT_DATA__"]/text()')

            if not script_nodes:
                return products

            next_data = json.loads(script_nodes[0])
            queries = next_data.get("props", {}).get("pageProps", {}).get("dehydratedState", {}).get("queries", [])

            search_results = []
            for query in queries:
                query_data = query.get("state", {}).get("data", {})
                if isinstance(query_data, dict) and "pages" in query_data:
                    pages = query_data.get("pages", [])
                    for page_item in pages:
                        if isinstance(page_item, dict) and "results" in page_item:
                            search_results.extend(page_item.get("results", []))

            self._total_items = len(search_results)
            self._total_pages = 1

            for item in search_results:
                raw_id = item.get("code") or item.get("_id")
                name = item.get("name", "")
                
                normal_price = item.get("normal_price") or 0
                discounted_price = item.get("discounted_price") or normal_price
                
                discount_percent = 0.0
                if normal_price > 0 and discounted_price < normal_price:
                    discount_percent = round(((normal_price - discounted_price) / normal_price) * 100, 1)

                image_rel = item.get("image", "")
                image_url = f"https://www.technolife.ir{image_rel}" if image_rel and image_rel.startswith("/") else image_rel

                product_id_num = raw_id.replace("TLP-", "") if isinstance(raw_id, str) else raw_id
                product_url = f"https://www.technolife.ir/product-{product_id_num}" if product_id_num else "https://www.technolife.ir"

                available_count = item.get("available") or 0
                is_in_stock = available_count > 0

                products.append(ProductOutput(
                    id=f"technolife_{raw_id}",
                    raw_id=raw_id,
                    title=name,
                    title_en="",
                    description="",
                    provider=self.provider_name,
                    provider_code=self.provider_code,
                    price=discounted_price * 10,
                    rrp_price=normal_price * 10,
                    price_toman=discounted_price,
                    rrp_price_toman=normal_price,
                    offer=discount_percent,
                    is_in_stock=is_in_stock,
                    image_url=image_url,
                    link=product_url
                ))

        except Exception:
            pass

        return products

    def search(self, query: str, page: int = 1) -> List[ProductOutput]:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }
        params = {
            "keywords": query
        }

        try:
            response = requests.get(self.BASE_URL, headers=headers, params=params, timeout=10)
            response.raise_for_status()
            self._data = self.scrap(response.text)
        except Exception:
            self._data = []
            self._total_items = 0
            self._total_pages = 0

        return self._data
