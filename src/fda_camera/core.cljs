(ns fda-camera.core
  (:require [reagent.core :as reagent :refer [atom]]
            [fda-camera.camera :as camera]))

(enable-console-print!)

;; define your app data so that it doesn't get over-written on reload

(defonce app-state (atom {:text "Face Detection App - Camera"}))

;; Components

(declare
 <top-cpnt>
  <header-panel>
  <control-panel>
  <camera-panel>
  <output-panel>)

(defn <top-cpnt> []
  (let [state @app-state]
    [:div.container.container-fluid
     [:div.row.show-grid
      [:div.col-md-12 [<header-panel>]]]
     [:div.row.show-grid
      [:div.col-md-3 [<control-panel>]]
      [:div.col-md-9 [<camera-panel>]]
      ]]))

(defn <header-panel> []
  [:div.cpnt-panel.header "header panel"]
  )

(defn <control-panel> []
  [:div.cpnt-panel.control "control panel"]
  )

(defn <camera-panel> []
  [:div.cpnt-panel.camera (camera/webcam)]
 )

;; Mount Components

(reagent/render-component
  [<top-cpnt>]
 (. js/document (getElementById "app")))


(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
)
