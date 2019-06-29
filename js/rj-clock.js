// rj-auxilary.js content (ES5, contains tools necessary for writing rj-clock.js)
var aUtils = aUtils || {
	// Removing class
	// pass only elSelector -> remove all classes from selected objects
	// pass elSelector and elClass -> remove elClass from selected objects
	removeClass: function (elSelector, elClass) {
		var argLength = arguments.length,
			elements,
			elCheckClass, 
			elCheckClassArray,
			elLength,
			i, j;
		
		// Checking if there is a node or elements collection
		if (elSelector === undefined || elSelector === null) {
			console.warn('The node doesn\'t exist');
			return;
		} else if (elSelector.nodeType === undefined) {
			elements = document.querySelectorAll(elSelector);
		} else {
			elements = elSelector;
		}
		
		if (elements.length === 0) {
			console.warn('There are no elements with this class');
			return;
		} else if (elements.length > 0) {
			elLength = elements.length;
			
			switch (argLength) {
			case 1:
				for (i = 0; i < elLength; i++) {
					elements[i].className = '';
				}
				break;
			case 2:
				for (i = 0; i < elLength; i++) {
					elCheckClass = elements[i].className;
					elCheckClassArray = elCheckClass.split(' ');
					
					for (j = 0; j < elCheckClassArray.length; j++) {
						if (elCheckClassArray[j] === elClass) {
							elCheckClassArray.splice(j, 1);
						}
					}
					
					if (elCheckClassArray.length === 0) {		// When after removing class the array is empty
						elements[i].className = '';
					} else if (elCheckClassArray.length === 1) {
						elements[i].className = elCheckClassArray[0];
					} else {
						elements[i].className = elCheckClassArray[0];
						
						for (j = 1; j < elCheckClassArray.length; j++) {
							elements[i].className += (' ' + elCheckClassArray[j]);
						}
					}
				}
				break;
			default:
				return;
			}
		} else {
			switch (argLength) {
			case 1:
				elements.className = '';
				break;
			case 2:
				elCheckClass = elements.className;
				elCheckClassArray = elCheckClass.split(' ');
				
				for (i = 0; i < elCheckClassArray.length; i++) {
					if (elCheckClassArray[i] === elClass) {
						elCheckClassArray.splice(i, 1);
					}
				}
				
				if (elCheckClassArray.length === 0) {		// When after removing class the array is empty
					elements.className = '';
				} else if (elCheckClassArray.length === 1) {
					elements.className = elCheckClassArray[0];
				} else {
					elements.className = elCheckClassArray[0];
					
					for (i = 1; i < elCheckClassArray.length; i++) {
						elements.className += (' ' + elCheckClassArray[i]);
					}
				}
				break;
			default:
				return;
			}					
		}
	},
	// Adding class
	// pass elSelector and elClass -> adds elClass to selected objects			
	addClass: function (elSelector, elClass) {
		var argLength = arguments.length,
			elSelector,
			elClass,
			elements,
			elLength,
			i;	
	
		// Checking if there is a node or elements collection
		if (elSelector === undefined || elSelector === null) {
			console.warn('The node doesn\'t exist');
			return;
		} else if (elSelector.nodeType === undefined) {
			elements = document.querySelectorAll(elSelector);
		} else {
			elements = elSelector;
		}

		if (elements.length === 0) {
			console.warn('There are no elements with this class');
			return;
		} else if (elements.length > 0) {
			elLength = elements.length;
			
			if (argLength === 2) {
				if (elLength > 0) {
					for (i = 0; i < elLength; i++) {
						if (elements[i].className === '') {
							elements[i].className = elClass;
						} else {
							if (elements[i].className.indexOf(elClass) >= 0) {
								return;
							} else {
								elements[i].className += (' ' + elClass);
							}
						}
					}
				} else {
					return;
				}
			} else {
				console.warn('There is no class selected to add');
				return;
			}
		} else {
			if (argLength === 2) {
				if (elements.className === '') {
					elements.className = elClass;
				} else {
					if (elements.className.indexOf(elClass) >= 0) {
						return;
					} else {
						elements.className += (' ' + elClass);
					}
				}
			} else {
				console.warn('There is no class selected to add');
				return;
			}					
		}
	},
	// Checking if object has class
	// pass elSelector and elClass -> check if selected object (only one!) has elClass
	hasClass: function (elSelector, elClass) {
		if (arguments.length === 2) {
			var result = false,
				elClass,
				elements, 
				classArray,
				i;
				
			// Checking if there is a node or elements collection
			if (elSelector === undefined || elSelector === null) {
				console.warn('The selector doesn\'t contain any element');
				return;
			} else if (typeof elSelector === 'string') {
				elements = document.querySelector(elSelector);
			} else {
				elements = elSelector;
			}			

			classArray = elements.className.split(' ');
			
			for (i = 0; i < classArray.length; i++) {
				if (classArray[i] === elClass) {
					result = true;
				}
			}
			return result;					
		} else {
			console.warn('Too less arguments');
			return;
		}			
	}
};

// rj-clock.js code
'use strict';
class rjClock {
    constructor(parentId, options) {
        const defaultOptions = {
            type: 'analog',
            style: 'dark',
            date: true,
            seconds: true
        }

        this.options = Object.assign({}, defaultOptions, options);
        this.parent = document.getElementById(parentId);
        this.moment = undefined;
        this.year = undefined;
        this.today = undefined;

        // Calculating UTC time - clock works on its basis
        function utcTime() {
            this.moment = new Date();
            this.year = this.moment.getUTCFullYear();
            this.today = Number(new Date(Date.UTC(this.year, this.moment.getUTCMonth(), this.moment.getUTCDate(), this.moment.getUTCHours(), this.moment.getUTCMinutes(), this.moment.getUTCSeconds())));
        }
        utcTime.bind(this)();   // Invoke immediately when script is loaded
        setInterval(utcTime.bind(this), 1000);     // Overwrite properties every second

        // Seeks for the date of first November sunday (US timeshift)
        // Always between 1st and 7th day of the month
        this.novemberFirstSundayDate = (() => {
            for (let i = 1; i <= 7; i++) {
                const dayTest = new Date(this.moment.getUTCFullYear() + "-11-" + i);
                if (dayTest.getDay() === 0) {
                    return dayTest.getDate();
                }
            }
        })();

        // Seeks for the date of second March sunday (US timeshift)
        // Always between 8th and 14th day of the month
        this.marchSecondSundayDate = (() => {
            for (let i = 8; i <= 14; i++) {
                const dayTest = new Date(this.moment.getUTCFullYear() + "-3-" + i);
                if (dayTest.getDay() === 0) {
                    return dayTest.getDate();
                }
            }
        })();

        // Seeks for the date of last March sunday (PL timeshift)
        // Always in fourth week of the month (days between 25th and 28th) or in fifth week of the month (days between 29th and 31th)
        this.marchLastSundayDate = (() => {
            for (let i = 25; i <= 31; i++) {
                const dayTest = new Date(this.moment.getUTCFullYear() + "-3-" + i);
                if (dayTest.getDay() === 0) {
                    return dayTest.getDate();
                }
            }
        })();

        // Seeks for the date of last October sunday (PL timeshift)
        // Always in fourth week of the month (days between 25th and 28th) or in fifth week of the month (days between 29th and 31th)
        this.octoberLastSundayDate = (() => {
            for (let i = 25; i <= 31; i++) {
                const dayTest = new Date(this.moment.getUTCFullYear() + "-10-" + i);
                if (dayTest.getDay() === 0) {
                    return dayTest.getDate();
                }
            }
        })();

        // Options error handling
        if (!(typeof this.options.seconds == 'boolean') || !(typeof this.options.date == 'boolean')) {
            throw new Error ('Date and seconds options value must be boolean');
        }

        // Preparing HTML structure of clock
        let clockInner = '';
        switch(this.options.type) {
            case 'digital':
                clockInner = '<p class="rjc-hour-container"><span class="rjc-hours"></span><span class="rjc-seperator">:</span><span class="rjc-minutes"></span>';
                this.options.seconds ? clockInner += '<span class="rjc-separator">:</span><span class="rjc-seconds"></span></p>' : clockInner += '</p>'
                if (this.options.date) clockInner += '<p class="rjc-date-container"><span class="rjc-day"></span><span class="rjc-separator">.</span><span class="rjc-month"></span><span class="rjc-separator">.</span><span class="rjc-year"></span></p>';
                break;
            case 'analog':
                clockInner = '<div class="rjc-hour-container"><div class="rjc-clock-face"><span class="rjc-hour-pointer"></span><span class="rjc-minutes-pointer"></span>';
                this.options.seconds ? clockInner += '<span class="rjc-seconds-pointer"></span></div></div>' : clockInner += '</div></div>'
                if (this.options.date) clockInner += '<p class="rjc-date-container"><span class="rjc-day"></span><span class="rjc-separator">.</span><span class="rjc-month"></span><span class="rjc-separator">.</span><span class="rjc-year"></span></p>';
                break;
            default:
                throw new Error ('Wrong clock type passed by options object');
                break;
        }

        // Setting HTML structure of clock
        aUtils.addClass(this.parent, `rjc-${this.options.type}`);
        this.parent.innerHTML = clockInner;

        // Set clock style
        const clockStyles = ['dark', 'light'];
        if(!clockStyles.includes(this.options.style)) {
            throw new Error('The clock style passed by options object doesn\'t exist');
        } else {
            aUtils.addClass(this.parent, `rjc-${this.options.style}`);
        }
    }
    // Function that sets needles on analog clock (according to calculated time)
    showClockFace(needles) {
        if (this.options.seconds) needles.sNeedle.style.transform = 'rotate(' + (needles.seconds * 6) + 'deg)';
        needles.mNeedle.style.transform = 'rotate(' + ((needles.minutes * 6) + (needles.seconds * 6 / 60)) + 'deg)';
        needles.hNeedle.style.transform = 'rotate(' + ((needles.hours * 30) + (needles.minutes * 6 / 12)) + 'deg)';
    }
    // Function that sets time values in nodes (needs to be separate function because
    // it has to run once when page is loaded and then in one second interval)
    setValues(clockVals) {
        let outputTime;
        // Set outputTime according to standard or dst time
        if (this.today >= clockVals.dstBegin && this.today < clockVals.stdBegin) {
            outputTime = new Date(this.today + clockVals.dstTime);
        } else {
            outputTime = new Date(this.today + clockVals.stdTime);
        }

        // Setting the date (if switched on)
        if (this.options.date) {
            if (outputTime.getUTCDate() < 10) {
                clockVals.outputDay.innerHTML = '0' + outputTime.getUTCDate();
            } else {
                clockVals.outputDay.innerHTML = outputTime.getUTCDate();
            }

            if (outputTime.getUTCMonth() < 10) {
                clockVals.outputMonth.innerHTML = '0' + (outputTime.getUTCMonth() + 1);
            } else {
                clockVals.outputMonth.innerHTML = outputTime.getUTCMonth();
            }

            clockVals.outputYear.innerHTML = outputTime.getUTCFullYear();
        }

        // Setting the time
        if (this.options.type === 'digital') {
            if (outputTime.getUTCHours() < 10) {
                clockVals.outputHours.innerHTML = '0' + outputTime.getUTCHours();
            } else {
                clockVals.outputHours.innerHTML = outputTime.getUTCHours();
            }

            if (outputTime.getUTCMinutes() < 10) {
                clockVals.outputMinutes.innerHTML = '0' + outputTime.getUTCMinutes();
            } else {
                clockVals.outputMinutes.innerHTML = outputTime.getUTCMinutes();
            }

            // Setting seconds only if switched on
            if (this.options.seconds) {
                if (outputTime.getUTCSeconds() < 10) {
                    clockVals.outputSeconds.innerHTML = '0' + outputTime.getUTCSeconds();
                } else {
                    clockVals.outputSeconds.innerHTML = outputTime.getUTCSeconds();
                }
            }
        } else if (this.options.type === 'analog') {
            this.showClockFace({
                sNeedle: clockVals.outputSeconds,
                mNeedle: clockVals.outputMinutes,
                hNeedle: clockVals.outputHours,
                hours: outputTime.getUTCHours(),
                minutes: outputTime.getUTCMinutes(),
                seconds: outputTime.getUTCSeconds()
            });
        }
    }
    // Shows time for specified place (standard offset must be provided in parameter for US clock)
    showTime(place, stdOffset) {
        let stdTime, dstTime, dstBegin, stdBegin;
        switch(place) {
            case 'us':
                // Buffer time offset values
                stdTime = stdOffset * 3600000;        // Offset for standard time
                dstTime = (stdOffset + 1) * 3600000;      // Offset for DST (Daylight Saving Time)

                // Set moment when offset is changing
                dstBegin = (new Date(Date.UTC(this.year, 2, this.marchSecondSundayDate, 7, 0))).getTime();
                stdBegin = (new Date(Date.UTC(this.year, 10, this.novemberFirstSundayDate, 6, 0))).getTime();
                break;
            case 'pl':
                // Buffer time offset values
                stdTime = 3600000;      // Offset for standard time
                dstTime = 7200000;      // Offset for DST (Daylight Saving Time)

                // Set time when offset is changed
                dstBegin = (new Date(Date.UTC(this.year, 2, this.marchLastSundayDate, 1, 0))).getTime();
                stdBegin = (new Date(Date.UTC(this.year, 9, this.octoberLastSundayDate, 1, 0))).getTime();
                break;
            default:
                throw new Error('Wrong place passed by options object');
                break;
        }

        // Buffer date element nodes (if they are switched on)
        let outputDay, outputMonth, outputYear;
        if (this.options.date) {
            outputDay = this.parent.querySelector('.rjc-day');
            outputMonth = this.parent.querySelector('.rjc-month');
            outputYear = this.parent.querySelector('.rjc-year');
        }

        // Buffer time element nodes
        let outputHours, outputMinutes, outputSeconds;
        if (this.options.type === 'digital') {
            outputHours = this.parent.querySelector('.rjc-hours');
            outputMinutes = this.parent.querySelector('.rjc-minutes');
            if (this.options.seconds) {
                outputSeconds = this.parent.querySelector('.rjc-seconds');
            }
        } else if (this.options.type === 'analog') {
            outputHours = this.parent.querySelector('.rjc-hour-pointer');
            outputMinutes = this.parent.querySelector('.rjc-minutes-pointer');
            if (this.options.seconds) {
                outputSeconds = this.parent.querySelector('.rjc-seconds-pointer');
            }
        }

        // Show time on clock
        this.setValues({dstBegin, stdBegin, dstTime, stdTime, outputDay, outputMonth, outputYear, outputHours, outputMinutes, outputSeconds});
        setInterval(() => {
            this.setValues({dstBegin, stdBegin, dstTime, stdTime, outputDay, outputMonth, outputYear, outputHours, outputMinutes, outputSeconds});
        }, 1000);
    }
}
