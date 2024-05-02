#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"
#else
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#endif

@interface RNPlotline : RCTEventEmitter <RCTBridgeModule>

@end