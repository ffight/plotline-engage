
package com.reactnativeplotline;

import android.app.Activity;
import android.graphics.RectF;
import android.view.View;
import android.view.ViewGroup;
import android.view.accessibility.AccessibilityNodeInfo;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;
import org.json.JSONException;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import so.plotline.insights.Listeners.PlotlineEventsListener;
import so.plotline.insights.Listeners.PlotlineRedirectListener;
import so.plotline.insights.Plotline;

public class RNPlotline extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNPlotline(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNPlotline";
  }

  @ReactMethod
  public void init(String apiKey, String userId, String endpoint) {
      final Activity activity = getCurrentActivity();
      Plotline.setFramework("REACT_NATIVE");
      Plotline.init(activity, apiKey, userId, endpoint);
      Plotline.setPlotlineEventsListener((eventName, eventProperties) -> {
          try {
              WritableMap writableMap = Arguments.createMap();
              Iterator<String> iterator = eventProperties.keys();

              while (iterator.hasNext()) {
                  String key = iterator.next();
                  Object value = eventProperties.get(key);

                  if (value instanceof String) {
                      writableMap.putString(key, (String) value);
                  } else if (value instanceof Integer) {
                      writableMap.putInt(key, (Integer) value);
                  } else if (value instanceof Double) {
                      writableMap.putDouble(key, (Double) value);
                  } else if (value instanceof Boolean) {
                      writableMap.putBoolean(key, (Boolean) value);
                  } else {
                      writableMap.putString(key, value.toString());
                  }
              }

              WritableMap event = Arguments.createMap();
              event.putString("eventName", eventName);
              event.putMap("properties", writableMap);

              getReactApplicationContext()
                      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                      .emit("PlotlineEvents", event);

          } catch (Exception e) {
              e.printStackTrace();
          }
      });

      Plotline.setPlotlineRedirectListener(redirectKeyValues -> {
          try {
              WritableMap writableMap = Arguments.createMap();

              for (Map.Entry<String, String> entry : redirectKeyValues.entrySet()) {
                  writableMap.putString(entry.getKey(), entry.getValue());
              }

              getReactApplicationContext()
                      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                      .emit("PlotlineRedirect", writableMap);
          } catch (Exception e) {
              e.printStackTrace();
          }
      });
  }
  
  @ReactMethod
  public void track(String eventName) {
    final Activity activity = getCurrentActivity();
    Plotline.track(eventName, activity);
  }

  public JSONObject getJSONObjectFromReadableMap(ReadableMap object) {
    JSONObject jsonObject = new JSONObject();
    if (object != null) {
      ReadableMapKeySetIterator iterator = object.keySetIterator();
      while (iterator.hasNextKey()) {
        String key = iterator.nextKey();
        ReadableType type = object.getType(key);
        try {
            switch (type) {
                case String:
                    jsonObject.put(key, object.getString(key));
                    break;
                case Number:
                    double doubleValue = object.getDouble(key);
                    if (doubleValue == (int) doubleValue) { 
                        jsonObject.put(key, (int) doubleValue);
                    } else {
                        jsonObject.put(key, doubleValue);
                    }
                    break;
                case Boolean:
                    jsonObject.put(key, object.getBoolean(key));
                    break;
                default:
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
      }
    }
    return jsonObject;
  }


  @ReactMethod
  public void track(String eventName, ReadableMap object){
    final Activity activity = getCurrentActivity();
    JSONObject properties = getJSONObjectFromReadableMap(object);
    Plotline.track(eventName, properties, activity);
  }

  @ReactMethod
  public void identify(ReadableMap object) {
    JSONObject jsonObject = getJSONObjectFromReadableMap(object);
    Plotline.identify(jsonObject);
  }

  @ReactMethod
  public void showMockStudy() {
    final Activity activity = getCurrentActivity();
    Plotline.showMockStudy(activity);
  }

  @ReactMethod
  public void setLocale(String locale) {
    Plotline.setLocale(locale);
  }

  @ReactMethod
  public void setColor(ReadableMap colors) {
    JSONObject jsonObject = new JSONObject();
    if (colors != null) {
      ReadableMapKeySetIterator iterator = colors.keySetIterator();
      while (iterator.hasNextKey()) {
        String key = iterator.nextKey();
        ReadableType type = colors.getType(key);
        if (type == ReadableType.String) {
          try {
            jsonObject.put((String) key, (String) colors.getString(key));
          } catch (JSONException e) {
            e.printStackTrace();
          }
        }
      }
    }
    Plotline.setColor(jsonObject);
  }

  @ReactMethod
  public void trackPage(String pageId) {
      final Activity activity = getCurrentActivity();
      Plotline.trackPage(pageId, activity);
  }

  @ReactMethod
  public void debug() {
      Plotline.debug(true);
  }

  @ReactMethod 
  public void notifyScroll() {
      Plotline.notifyScroll();
  }

  @ReactMethod
  public void logout() {
      Plotline.logout();
  }
}