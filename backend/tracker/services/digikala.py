import requests
from typing import List, Any
from tracker.services.base import BaseScraper, ProductOutput


class DigikalaScraper(BaseScraper):
    provider_name = "دیجی‌کالا"
    provider_code = "digikala"
    BASE_URL = "https://api.digikala.com/discovery/api/v2/search/"

    def scrap(self, raw_data: Any) -> List[ProductOutput]:
        top_widgets = raw_data.get("data", {}).get("widgets", [])
        pager_info = raw_data.get("data", {}).get("pager", {})

        product_widgets = []
        for widget in top_widgets:
            w_type = widget.get("type")
            if w_type == "vertical_product_listing":
                w_data = widget.get("data", {})
                if not pager_info:
                    pager_info = w_data.get("pager", {})
                product_widgets.extend(w_data.get("widgets", []))
            elif w_type == "product":
                product_widgets.append(widget)

        self._total_items = pager_info.get("total_items", len(product_widgets))
        self._total_pages = pager_info.get("total_pages", 1)

        products: List[ProductOutput] = []
        seen_ids = set()

        for p_widget in product_widgets:
            if p_widget.get("type") != "product":
                continue

            p_data = p_widget.get("data", {})
            p_id = p_data.get("id")

            if not p_id or p_id in seen_ids:
                continue

            seen_ids.add(p_id)

            title_fa = p_data.get("title_fa", "")
            title_en = p_data.get("title_en", "")
            uri = p_data.get("url", {}).get("uri", "")
            product_url = f"https://www.digikala.com{uri}" if uri else ""

            data_layer = p_data.get("data_layer", {})
            brand = data_layer.get("brand", "")

            images = p_data.get("images", {}).get("main", {}).get("url", [])
            image_url = images[0] if images else ""

            default_variant = p_data.get("default_variant", {})
            price_info = default_variant.get("price", {})

            selling_price = price_info.get("selling_price", 0)
            rrp_price = price_info.get("rrp_price", 0)
            discount_percent = float(price_info.get("discount_percent", 0))

            status = p_data.get("status", "")
            is_in_stock = status == "marketable"

            products.append(ProductOutput(
                id=f"digikala_{p_id}",
                raw_id=p_id,
                title=title_fa,
                title_en=title_en,
                description=brand,
                provider=self.provider_name,
                provider_code=self.provider_code,
                price=selling_price,
                rrp_price=rrp_price,
                price_toman=selling_price // 10 if selling_price else 0,
                rrp_price_toman=rrp_price // 10 if rrp_price else 0,
                offer=discount_percent,
                is_in_stock=is_in_stock,
                image_url=image_url,
                link=product_url
            ))

        return products

    def search(self, query: str, page: int = 1) -> List[ProductOutput]:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json"
        }
        params = {
            "q": query,
            "page": page
        }

        try:
            response = requests.get(self.BASE_URL, headers=headers, params=params, timeout=10)
            response.raise_for_status()
            raw_data = response.json()
            self._data = self.scrap(raw_data)
        except Exception:
            self._data = []
            self._total_items = 0
            self._total_pages = 0

        return self._data
