//
//  PlotlineWidgetEventEmitter.h
//  plotline-engage
//
//  Created by SHUBH  SARASWAT on 11/09/23.
//

#import <React/RCTEventEmitter.h>

@interface PlotlineWidgetEventEmitter : RCTEventEmitter
@property (nonatomic) BOOL hasListeners;  
- (void)sendSizeEventWithWidth:(CGFloat)width height:(CGFloat)height sizeForTestID:(NSString *)sizeForTestID;
@end


