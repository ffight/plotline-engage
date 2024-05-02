//
//  PlotlineView.swift
//  plotline-engage
//
//  Created by SHUBH  SARASWAT on 20/08/23.
//

#import "PlotlineWidgetEventEmitter.h"

@implementation PlotlineWidgetEventEmitter

RCT_EXPORT_MODULE(PlotlineWidgetEventEmitter)

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onPlotlineWidgetReady"];
}

- (void)sendSizeEventWithWidth:(CGFloat)width height:(CGFloat)height sizeForTestID:(NSString *)sizeForTestID {
    if (self.hasListeners) {
        [self sendEventWithName:@"onPlotlineWidgetReady" body:@{
            @"width": @(width),
            @"height": @(height),
            @"sizeForTestID": sizeForTestID
        }];
    }
}

- (void)startObserving {
    self.hasListeners = YES;
}

- (void)stopObserving {
    self.hasListeners = NO;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

@end

