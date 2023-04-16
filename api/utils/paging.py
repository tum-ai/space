from typing import Callable

from functools import wraps
from fastapi import Request

"""usage: place decorator before function: 
'def endpoint(request, page, page_size)'
- page: 1-based index
- page_size: size of pages
"""


def enable_paging(max_page_size: int = 1000):
    def outer_wrapper(func: Callable):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            if 'page_size' in kwargs and kwargs.get('page_size'):
                kwargs.update({
                    # limit to [1;max_page_size]
                    'page_size': min(max(kwargs.get('page_size'), 1), max_page_size)
                })

            kwargs.update({
                'page': max(1, kwargs.get('page', 1)),
            })

            return func(request, *args, **kwargs)

        return wrapper

    return outer_wrapper
