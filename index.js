
import { NativeModules, DeviceEventEmitter, Platform, NativeEventEmitter, requireNativeComponent } from 'react-native';
import { View } from 'react-native';
import React, { useEffect, useState, forwardRef } from 'react';
const { RNPlotline } = NativeModules;
import { NavigationContainer as RNNavigationContainer, useNavigationContainerRef } from '@react-navigation/native';

function getRouteName(state) {
  if (!state || !state.routes || state.index === undefined || state.index === null) {
    return 'unrecognized-path'
  }
  const route = state.routes[state.index]
  if (route.state) {
    return getRouteName(route.state)
  }
  return route.name
}

function convertToStringValues(obj) {
    const convertedObj = {};
  
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        if (typeof value === 'number') {
          convertedObj[key] = String(value);
        } 
        else if (typeof value === 'boolean') {
          convertedObj[key] = value ? "true" : "false";
        } 
        else if (typeof value === 'string') {
          convertedObj[key] = value;
        }
      }
    }
  
    return convertedObj;
}

class plotline {
    constructor() {
        this.throttledNotifyScroll = this.throttle(this.handleScroll, 250);
        this.plotlineEventsListener = null;
        this.plotlineRedirectListener = null;

        if (Platform.OS === 'android') {
            this.plotlineEventsSubscription = DeviceEventEmitter.addListener('PlotlineEvents', (event) => {
                this._notifyEvent(event.eventName, event.properties);
            });
            this.plotlineRedirectSubscription = DeviceEventEmitter.addListener('PlotlineRedirect', (keyValuePairs) => {
                this._notifyRedirect(keyValuePairs);
            });
        } else if (Platform.OS === 'ios') {
            const myNativeEventEmitterModule = new NativeEventEmitter(NativeModules.RNPlotline);
            this.plotlineEventsSubscription = myNativeEventEmitterModule.addListener('PlotlineEvents', (event) => {
                this._notifyEvent(event.eventName, event.properties);
            });
            this.plotlineRedirectSubscription = myNativeEventEmitterModule.addListener('PlotlineRedirect', (keyValuePairs) => {
                this._notifyRedirect(keyValuePairs);
            });
        }
    }

    throttle(func, limit) {
        let inThrottle = false;
        return function () {
          if (!inThrottle) {
            func.apply(this, arguments);
            inThrottle = true;
            setTimeout(() => {
              inThrottle = false;
            }, limit);
          }
        };
    }

    track (eventName, properties) {
        if (properties)
            RNPlotline.track(eventName, convertToStringValues(properties));
        else
            RNPlotline.track(eventName, null);
    }

    init (apiKey, refId, endpoint = null) {
        RNPlotline.init(apiKey, refId, endpoint);
    }

    identify (obj) {
        RNPlotline.identify(convertToStringValues(obj));
    }

    setLocale (locale) {
        RNPlotline.setLocale(locale);
    }

    showMockStudy () {
        RNPlotline.showMockStudy();
    }

    setColor (colors) {
        RNPlotline.setColor(colors);
    }

    trackPage (pageId) {
        RNPlotline.trackPage(pageId);
    }

    debug () {
        RNPlotline.debug();
    }

    handleScroll() {
        RNPlotline.notifyScroll();
    }

    notifyScroll() {
        this.throttledNotifyScroll();
    }

    setPlotlineEventsListener(plotlineEventsListener) {
        this.plotlineEventsListener = plotlineEventsListener;
    }

    setPlotlineRedirectListener(plotlineRedirectListener) {
        this.plotlineRedirectListener = plotlineRedirectListener;
    }

    _notifyEvent(eventName, properties) {
        if (this.plotlineEventsListener) {
            this.plotlineEventsListener(eventName, properties);
        }
    }

    _notifyRedirect(keyValuePairs) {
        if (this.plotlineRedirectListener) {
            this.plotlineRedirectListener(keyValuePairs);
        }
    }

    logout() {
        if (this.plotlineEventsSubscription) {
            this.plotlineEventsSubscription.remove();
            this.plotlineEventsSubscription = null;
        }
        if (this.plotlineRedirectSubscription) {
            this.plotlineRedirectSubscription.remove();
            this.plotlineRedirectSubscription = null;
        }
        RNPlotline.logout();
    }
}

const Plotline = new plotline();

const { PlotlineWidgetEventEmitter } = NativeModules;
const plotlineEvents = new NativeEventEmitter(PlotlineWidgetEventEmitter);
const PlotlineView = requireNativeComponent('PlotlineView');

const PlotlineWidget = ({ testID }) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [layout, setLayout] = useState(null);
  
  useEffect(() => {

    if (Platform.OS === 'android') return;

    const subscription = plotlineEvents.addListener(
      'onPlotlineWidgetReady',
      (event) => {
        const { width, height, sizeForTestID } = event;
        if (sizeForTestID === testID) {
            setSize({ width, height });
        }
      }
    );
    
    return () => {
      subscription.remove();
    };
  }, []);

  if (Platform.OS === 'android') {
    return <PlotlineView testID={testID} />;
  } else if (Platform.OS === 'ios') {
      return (
        <View
            onLayout={(e) =>{
                setLayout(e.nativeEvent.layout);
            }}>
            <PlotlineView 
                testID={testID} 
                style={{ width: size.width, height: size.height }}
                parentWidth={layout ? layout.width.toString() : "0"}
                />
        </View>
      );
  }
  return null;
};

const NavigationContainer = forwardRef(({children, ...others}, ref) => {
  const containerRef = useNavigationContainerRef()

  useEffect(() => {
    if (containerRef.current) {
      const currentRoute = containerRef.current.getCurrentRoute()
      if (currentRoute) {
        Plotline.trackPage(currentRoute.name);
      }
    }
  }, [containerRef])

  const handleStateChange = (state) => {
    if (others?.onStateChange != null) {
      others.onStateChange(state)
    }
    const routeName = getRouteName(state)
    Plotline.trackPage(routeName);
  }

  return (
    <RNNavigationContainer
      {...others}
      onStateChange={handleStateChange}  
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
    >
      {children}
    </RNNavigationContainer>
  )
});

export default Plotline;
export {PlotlineWidget, NavigationContainer};
