import { Command } from '@tauri-apps/plugin-shell';
import { message } from '@tauri-apps/plugin-dialog';

console.log('main.js loaded successfully');

async function wipeDevice(device, passes, output) {
    try {
        console.log('wipeDevice called with:', { device, passes, output });

        const command = Command.sidecar('wipe_tool', [
            '-device', device,
            '-passes', passes.toString(),
            '-output', output
        ]);

        console.log('Executing sidecar with args:', ['-device', device, '-passes', passes.toString(), '-output', output]);

        const result = await command.execute();
        console.log('Sidecar result:', result);

        if (result.code !== 0) {
            throw new Error(`CLI failed: ${result.stderr}`);
        }

        console.log('Wipe result:', result.stdout);
        await message(
            `Wipe successful! Certificates saved to ${output}.pdf and ${output}.json`,
            { title: 'Success', kind: 'info' }
        );

        return result.stdout;
    } catch (error) {
        console.error('Wipe failed:', error);
        await message(`Wipe failed: ${error.message}`, { title: 'Error', kind: 'error' });
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    const wipeButton = document.getElementById('wipe-button');

    if (wipeButton) {
        console.log('Wipe button found');
        wipeButton.addEventListener('click', async () => {
            console.log('Wipe button clicked');
            const device = document.getElementById('device-input')?.value || 'testfile.img';
            const passes = parseInt(document.getElementById('passes-input')?.value) || 3;
            const output = document.getElementById('output-input')?.value || './wipe-cert';
            const resultDiv = document.getElementById('result');

            console.log('Inputs:', { device, passes, output });
            resultDiv.textContent = 'Wiping... Please wait.';
            resultDiv.className = 'result loading';

            try {
                await wipeDevice(device, passes, output);
                resultDiv.textContent = `Success: Certificates saved to ${output}.pdf and ${output}.json`;
                resultDiv.className = 'result success';
            } catch (error) {
                resultDiv.textContent = `Error: ${error.message}`;
                resultDiv.className = 'result error';
            }
        });
    } else {
        console.error('Wipe button not found');
    }
});
