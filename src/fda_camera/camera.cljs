(ns fda-camera.camera
  (:require [cljsjs.react]
            [cljs.nodejs :as node]))

(def webcam (node/require "react-webcam"))
