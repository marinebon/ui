import "@marinebon/ui/styles.css";
import "./demo.css";
import { mount } from "svelte";
import { initTheme } from "@marinebon/ui";
import App from "./App.svelte";

initTheme();
mount(App, { target: document.getElementById("app")! });
