package com.reactnativeplotline;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import so.plotline.insights.PlotlineWidget;

public class PlotlineViewManager extends ViewGroupManager<PlotlineWrapperView> {
    public static final String REACT_CLASS = "PlotlineView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactProp(name = "testID")
    public void setTestId(PlotlineWrapperView view, String testID) {
        PlotlineWidget widget = (PlotlineWidget) view.getContentView();
        widget.setElementId(testID);
    }

    @Override
    protected PlotlineWrapperView createViewInstance(ThemedReactContext reactContext) {
        PlotlineWrapperView wrapperView = new PlotlineWrapperView(reactContext);
        PlotlineWidget plotlineWidget = new PlotlineWidget(reactContext);
        wrapperView.setContentView(plotlineWidget);
        return wrapperView;
    }
}