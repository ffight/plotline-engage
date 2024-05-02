
#import "RNPlotline.h"
#import <Plotline/Plotline-Swift.h>
#import <React/RCTEventEmitter.h>

@implementation RNPlotline

- (NSArray<NSString *> *)supportedEvents {
  return @[@"PlotlineEvents",@"PlotlineRedirect"];
}

RCT_EXPORT_METHOD(init:(NSString *)apiKey userId:(NSString *)userId endpoint:(NSString *)endpoint)
{
 [Plotline setPlotlineFrameworkWithFramework:@"REACT_NATIVE"];
 if (endpoint != nil) {
    [Plotline initializeWithApiKey:apiKey userId:userId endpoint:endpoint];
 } else {
    [Plotline initializeWithApiKey:apiKey userId:userId];
 }
 [Plotline setPlotlineEventsListenerWithListener:^(NSString *eventName, NSDictionary *eventProperties) {
    NSDictionary *event = @{
      @"eventName": eventName,
      @"properties": eventProperties
    };
    [self sendEventWithName:@"PlotlineEvents" body:event];
  }];
 [Plotline setPlotlineRedirectListenerWithListener:^(NSDictionary<NSString *, NSString *> * redirectKeyValues) {
    [self sendEventWithName:@"PlotlineRedirect" body:redirectKeyValues];
 }];
}

RCT_EXPORT_METHOD(track:(NSString *)eventName properties: (NSDictionary *) properties)
{
 if(properties != nil) {
  [Plotline trackWithEventName:eventName properties:properties];
 } else {
  [Plotline trackWithEventName:eventName];
 }
}

RCT_EXPORT_METHOD(setLocale:(NSString *)locale)
{
 [Plotline setLocaleWithLocale:locale];
}

RCT_EXPORT_METHOD(identify:(NSDictionary *)attribute)
{
 [Plotline identifyWithAttributes:attribute];
}

RCT_EXPORT_METHOD(showMockStudy)
{
 [Plotline showMockStudy];
}

RCT_EXPORT_METHOD(setColor:(NSDictionary *)colors)
{
 [Plotline setColorWithColors:colors];
}

RCT_EXPORT_METHOD(debug)
{
 [Plotline debugWithShouldDebug:true];
}

RCT_EXPORT_METHOD(notifyScroll)
{
 [Plotline notifyScroll];
}

RCT_EXPORT_METHOD(trackPage:(NSString *)pageName)
{
 [Plotline trackPageWithPageName:pageName];
}

RCT_EXPORT_METHOD(logout)
{
 [Plotline logout];
}

RCT_EXPORT_MODULE();

@end
  
