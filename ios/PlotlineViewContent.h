//
//  PlotlineViewContent.h
//  plotline-engage
//
//  Created by SHUBH  SARASWAT on 11/09/23.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <Plotline/Plotline.h>

@interface PlotlineViewContent : UIView <PlotlineWidgetListener>
@property (nonatomic, strong) RCTBridge *eventBridge;
@property (nonatomic, strong) NSString *parentWidth;
@property (nonatomic, strong) NSString *testID;
@property (nonatomic, strong) UIView *plotlineView;  
@end


