---
title: 'HEX to RGBA'
description: 'Farben in HEX-Angaben zu RGBA umwandeln.'
date: 2023-09-27
syntax: 'php'
tags: ['hex', 'rgba', 'convert']
---
```php
/* Convert hexdec color string to rgb(a) string */
function hex2rgba($color, $opacity = false) {

	$default = 'rgb(0,0,0)';

	//Return default if no color provided
	if(empty($color))
          return $default;

	//Sanitize $color if "#" is provided
        if ($color[0] == '#' ) {
        	$color = substr( $color, 1 );
        }

        //Check if color has 6 or 3 characters and get values
        if (strlen($color) == 6) {
                $hex = array( $color[0] . $color[1], $color[2] . $color[3], $color[4] . $color[5] );
        } elseif ( strlen( $color ) == 3 ) {
                $hex = array( $color[0] . $color[0], $color[1] . $color[1], $color[2] . $color[2] );
        } else {
                return $default;
        }

        //Convert hexadec to rgb
        $rgb =  array_map('hexdec', $hex);

        //Check if opacity is set(rgba or rgb)
        if($opacity){
        	if(abs($opacity) &gt; 1)
        		$opacity = 1.0;
        	$output = 'rgba('.implode(",",$rgb).','.$opacity.')';
        } else {
        	$output = 'rgb('.implode(",",$rgb).')';
        }

        //Return rgb(a) color string
        return $output;
}
```

Here's a usage example how to use this function for dynamicaly created CSS.

```php
$color = '#ffa226';
$rgb = hex2rgba($color);
$rgba = hex2rgba($color, 0.7);
```

CSS Output
```php
echo '
	div.example{
	 background: '.$rgb.';
	 color: '.$rgba.';
	}
';
```