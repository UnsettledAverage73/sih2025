#![allow(unused_variables)]

#[tauri::command]
async fn erase_drive(device: String, passes: u32, output: String) -> Result<String, String> {
    println!("Received erase_drive command:");
    println!("  Device: {}", device);
    println!("  Passes: {}", passes);
    println!("  Output: {}", output);

    // Simulate a secure wipe operation
    // In a real application, you would call your Go backend or Rust logic here.
    // For now, we just return a success message.
    
    // Example of error handling:
    if device.is_empty() {
        return Err("Device path cannot be empty.".to_string());
    }
    if passes == 0 {
        return Err("Number of passes cannot be zero.".to_string());
    }

    // In a real scenario, this would interact with the wipe_tool or Go backend.
    // For demonstration, we'll just log and return success.
    println!("INFO: Initiating wipe for {} with {} passes.", device, passes);
    Ok(format!("Successfully initiated wipe for {} with {} passes. Certificate will be saved to {}.", device, passes, output))
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![erase_drive])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
