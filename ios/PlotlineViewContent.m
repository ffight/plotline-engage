//
//  PlotlineViewContent.m
//  plotline-engage
//
//  Created by SHUBH  SARASWAT on 11/09/23.
//

#import "PlotlineViewContent.h"
#import "PlotlineWidgetEventEmitter.h"
#import <Plotline/Plotline.h>

@implementation PlotlineViewContent

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        
    }
    return self;
}

- (void)setParentWidth:(NSString *)parentWidth {
    if (![_parentWidth isEqualToString:parentWidth]) {
        _parentWidth = parentWidth;
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.plotlineView removeFromSuperview];
            if (parentWidth.integerValue != 0) {
                self.plotlineView = [[PlotlineWidget alloc] initWithClientElementId:self.testID frame:CGRectMake(0, 0, parentWidth.integerValue, 0) plotlineWidgetListener:self];
                self.plotlineView.translatesAutoresizingMaskIntoConstraints = NO;
                [self addSubview:self.plotlineView];
            }
        });
    }
}

- (void)setTestID:(NSString *)testID {
    _testID = testID;

}

- (void)onWidgetReadyWithWidth:(CGFloat)width height:(CGFloat)height {
    PlotlineWidgetEventEmitter *plotlineWidgetEventEmitter = [self.eventBridge moduleForClass:[PlotlineWidgetEventEmitter class]];
    [plotlineWidgetEventEmitter sendSizeEventWithWidth:width height:height sizeForTestID:self.testID];
}

@end
