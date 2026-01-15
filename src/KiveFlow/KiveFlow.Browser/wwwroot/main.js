import { dotnet } from './_framework/dotnet.js'

const is_browser = typeof window != "undefined";
if (!is_browser) throw new Error(`Expected to be running in a browser`);

const dotnetRuntime = await dotnet
    .withDiagnosticTracing(false)
    .withApplicationArgumentsFromQuery()
    .create();

const config = dotnetRuntime.getConfig();

// --- 设置开屏最小显示时间为3秒 ---
const minimumSplashDisplayTime = 3000;

// 先记录开始时间
const startTime = Date.now();

// 启动.NET应用
const appLoadPromise = dotnetRuntime.runMain(config.mainAssemblyName, [globalThis.location.href]);

// 等待应用加载完成
await appLoadPromise;

// 计算已显示时间
const elapsedTime = Date.now() - startTime;

// 如果显示时间不足3秒，则等待剩余时间
if (elapsedTime < minimumSplashDisplayTime) {
    const remainingTime = minimumSplashDisplayTime - elapsedTime;
    await new Promise(resolve => setTimeout(resolve, remainingTime));
}

// 现在隐藏开屏界面
const splashElement = document.getElementById('logoview');
if (splashElement) {
    splashElement.style.display = 'none';
}