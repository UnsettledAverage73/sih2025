import { invoke } from '@tauri-apps/api/tauri';
import { dialog } from '@tauri-apps/api/dialog';

async function wipeDevice(device, passes, output) {
    try {
        const result = await invoke('run_wipe', {
            cmd: './build/wipe_tool', // Use 'build\\wipe_tool.exe' for Windows
            args: ['-device', device, '-passes', passes.toString(), '-output', output]
        });
        console.log('Wipe result:', result);
        await dialog.message(`Wipe successful! Certificates saved to ${output}.pdf and ${output}.json`);
        return result;
    } catch (error) {
        console.error('Wipe failed:', error);
        await dialog.message(`Wipe failed: ${error}`, { title: 'Error', type: 'error' });
        throw error;
    }
}

document.getElementById('wipe-button')?.addEventListener('click', async () => {
    const device = document.getElementById('device-input')?.value || 'testfile.img';
    const passes = parseInt(document.getElementById('passes-input')?.value) || 3;
    const output = document.getElementById('output-input')?.value || './wipe-cert';
    const resultDiv = document.getElementById('result');

    resultDiv.textContent = 'Wiping... Please wait.';
    resultDiv.className = 'mt-4 text-sm text-blue-600';

    try {
        await wipeDevice(device, passes, output);
        resultDiv.textContent = `Success: Certificates saved to ${output}.pdf and ${output}.json`;
        resultDiv.className = 'mt-4 text-sm text-green-600';
    } catch (error) {
        resultDiv.textContent = `Error: ${error}`;
        resultDiv.className = 'mt-4 text-sm text-red-600';
    }
});
