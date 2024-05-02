//
//  PlotlineView.m
//  RNPlotline
//
//  Created by SHUBH  SARASWAT on 16/08/23.
//  Copyright © 2023 Facebook. All rights reserved.
//

#import "PlotlineView.h"
#import "PlotlineViewContent.h"

@implementation PlotlineView

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(parentWidth, NSString)
RCT_EXPORT_VIEW_PROPERTY(testID, NSString)

- (UIView *)view {
    PlotlineViewContent *myView = [[PlotlineViewContent alloc] init];
    myView.eventBridge = self.bridge;
    return myView;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

@end
