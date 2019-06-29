# rj-clock - US, PL clock widget

rj-clock displays configurable analog or digital clock widget. It is designed in the way that includes Daylight Saving Time Changes for Poland and United States.
This plugin has been created for one of my commercial projects.

## How to use

1. Upload CSS, JS and IMG files to your project
2. Add proper links to files in your HTML
3. Check if url addresses for images are set properly for your project file system in CSS file (lines: 28, 32, 44, 48, 52)
3. Add clock with configuration object in your HTML in a way presented in "Configuration" below

## Configuration

To add clock with complete configuration object use this code and configure it in a way displayed below snippet:

```Javascript
const clockName = new rjClock('parentElementId', {
    type: 'analog',
    style: 'dark',
    seconds: true,
    date: true
}).showTime(place, stdOffset);
```

The code presented above contains a configuration object. These are also default options so if you don't provide any of options when adding clock, clock will be added to your page with these options. Now lets get further information about every configuration options:

* `parentElementId` - in this place you must provide an id of HTML element in which the clock will be inserted **(string)**
* `type` - clock type. You can choose between `digital` and `analog` **(string)**
* `style` - clock style. You can choose between `dark` and `light` **(string)**
* `seconds` - choose whether the clock should display seconds or not - `true` or `false` **(boolean)**
* `date` - choose whether the clock should display date or not - `true` or `false` **(boolean)**
* `place` - choose clock for Poland - `pl` or for United States - `us` **(string)**
* `stdOffset` - it should be provided when in `place` you have chosen `us`. Explanation: in Poland there is one timezone in whole country. In United States this value varies (different states have different timezones). So you must decide for which state or city you display the time and accordingly - provide the timezone offset value for this place. e.g: Washington is UTC/GMT - 5 hours (in standard time) so in this example you set `stdOffset` as `-5` **(number)**

Final code for Washington:
```Javascript
const clockUS = new rjClock('us-clock', {
    type: 'analog',
    style: 'light',
    seconds: true,
    date: false
}).showTime('us', -5);
```

## Technologies used
* JavaScript (ES5, ES6)
* CSS
* HTML

## Project status
Finished
