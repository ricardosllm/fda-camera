(ns fda-camera.core
  (:require [reagent.core :as reagent :refer [atom]]))

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
    [:div.container-fluid
     [:div.row.show-grid
      [:div.col-md-12 [<header-panel>]]]
     [:div.row.show-grid
      [:div.col-md-4 [<control-panel>]]
      [:div.col-md-4 [<camera-panel>]]
      [:div.col-md-4 [<output-panel>]]]]))

(defn <header-panel> []
  [:div "header panel"]
  )

(defn <control-panel> []
  [:div "control panel"]
  )

(defn <camera-panel> []
 [:div "camera panel"]
 )

(defn <output-panel> []
  [:div "output panel"]
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
