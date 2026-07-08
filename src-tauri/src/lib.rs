#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_companion,
            close_companion,
            set_companion_pinned,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// `set_always_on_top` + `set_visible_on_all_workspaces` alone are not always
// enough for a window to draw over a *fullscreened* app's Space on macOS —
// that additionally requires the NSWindow's collectionBehavior to include
// fullScreenAuxiliary and a window level high enough to sit above it. We set
// those directly via the raw NSWindow handle for full certainty.
fn apply_companion_pin(window: &tauri::WebviewWindow, pinned: bool) -> Result<(), String> {
    window.set_always_on_top(pinned).map_err(|e| e.to_string())?;
    window
        .set_visible_on_all_workspaces(pinned)
        .map_err(|e| e.to_string())?;

    #[cfg(target_os = "macos")]
    {
        let ns_window = window.ns_window().map_err(|e| e.to_string())?;
        unsafe {
            use objc2::msg_send;
            use objc2::runtime::AnyObject;

            let win = ns_window as *mut AnyObject;
            // NSWindowCollectionBehaviorCanJoinAllSpaces (1) | Stationary (16) | FullScreenAuxiliary (256)
            let behavior: usize = if pinned { 1 | 16 | 256 } else { 0 };
            let _: () = msg_send![win, setCollectionBehavior: behavior];
            // CGWindowLevelForKey(.maximumWindow) — the highest level macOS allows,
            // used by overlay utilities that must float above fullscreened apps.
            let level: isize = if pinned { 2147483631 } else { 0 };
            let _: () = msg_send![win, setLevel: level];
        }
    }

    Ok(())
}

#[tauri::command]
async fn open_companion(app: tauri::AppHandle) -> Result<(), String> {
    use tauri::Manager;
    if let Some(window) = app.get_webview_window("companion") {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
        apply_companion_pin(&window, true)?;
    }
    Ok(())
}

#[tauri::command]
async fn close_companion(app: tauri::AppHandle) -> Result<(), String> {
    use tauri::Manager;
    if let Some(window) = app.get_webview_window("companion") {
        window.hide().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn set_companion_pinned(app: tauri::AppHandle, pinned: bool) -> Result<(), String> {
    use tauri::Manager;
    let window = app
        .get_webview_window("companion")
        .ok_or_else(|| "companion window not found".to_string())?;
    apply_companion_pin(&window, pinned)
}
