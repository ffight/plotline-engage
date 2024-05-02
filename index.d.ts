import React from 'react';
import { NavigationContainer as RNNavigationContainer } from '@react-navigation/native';

declare class plotline {
    track(eventName: string, properties: {[key: string]: string}): void;
    init(apiKey: string, refId: string, endpoint?: string): void;
    identify(attributes: {[key: string]: string}): void;
    setLocale(locale: string): void;
    showMockStudy(): void;
    setColor(colors: {[key: string]: string}): void;
    trackPage(pageId: string): void;
    debug(): void;
    notifyScroll(): void;
    setPlotlineEventsListener(listener: (eventName: string, properties: {[key: string]: any}) => void): void;
    setPlotlineRedirectListener(listener: (keyValuePairs: {[key: string]: any}) => void): void;
    logout(): void;
}

declare const NavigationContainer = RNNavigationContainer;

interface PlotlineWidgetProps extends ViewProps {
    testID?: string;
}

declare class PlotlineWidget extends React.Component<PlotlineWidgetProps> {
}

declare const Plotline: plotline;
export { NavigationContainer, PlotlineWidget };
export default Plotline;
