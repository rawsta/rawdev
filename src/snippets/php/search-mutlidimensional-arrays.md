---
title: 'Search Mutlidimensional Arrays'
description: 'Mehrdimensionale Arrays durchsuchen.'
date: 2023-09-27
syntax: 'php'
tags: ['array', 'search']
---
```php
/**
 * Search multdimensional arrays like on flat arrays.
 *
 * @param  string $needle
 * @param  array $haystack
 *
 * @return bool true if found, else false
 */
function sc_search_array( $needle, $haystack ) {

	if ( in_array( $needle, $haystack ) ) {
		return true;
	}
	foreach ( $haystack as $item ) {
		if ( is_array( $item ) && array_search( $needle, $item ) )
		return true;
	}
	return false;
}
```