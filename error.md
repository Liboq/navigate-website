# API 路由错误处理总结

## 截图服务相关错误 (screen/route.ts)

### 1. Chromium 启动错误
```bash
Failed to launch the browser process!
/tmp/chromium: error while loading shared libraries: libnspr4.so
```

#### 解决方案
- 使用兼容的 Chromium 版本
- 添加必要的启动参数
```typescript
const options = {
  args: [
    ...chromium.args,
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
  ],
  executablePath: process.env.NODE_ENV === 'production'
    ? await chromium.executablePath()
    : '本地Chrome路径',
  headless: true
};
```

### 2. 环境兼容性错误
```bash
The input directory "/var/task/.next/server/app/api/bin" does not exist
```

#### 解决方案
- 配置 vercel.json
```json
{
  "functions": {
    "app/api/screen/route.ts": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

## 网站信息抓取错误 (scrape/route.ts)

### 1. 数据验证错误
```typescript
if (!url || !categoryName || !image || !title) {
  return NextResponse.json(
    { error: '缺少必要的信息' }, 
    { status: 400 }
  );
}
```

### 2. 重复数据错误
```typescript
if (sites.some(site => site.url === url)) {
  return NextResponse.json(
    { error: '该网站已经添加过了' }, 
    { status: 400 }
  );
}
```

## 截图处理错误 (screenshot/route.ts)

### 1. 上传超时错误
```typescript
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetry(url: string, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      // 请求逻辑
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(RETRY_DELAY);
    }
  }
}
```

### 2. 图片处理错误
```typescript
try {
  const imageUrl = await uploadToTencentCOS(
    `data:image/jpeg;base64,${screenshot}`,
    filename
  );
} catch (error) {
  console.error('Upload error:', error);
  return NextResponse.json(
    { error: '图片上传失败' },
    { status: 500 }
  );
}
```

## 通用错误处理策略

### 1. 错误响应格式统一
```typescript
return NextResponse.json(
  { 
    error: error instanceof Error ? error.message : '未知错误',
    code: status,
    timestamp: new Date().toISOString()
  }, 
  { status }
);
```

### 2. 错误日志记录
```typescript
console.error('Error details:', {
  api: 'screen/route.ts',
  error: error instanceof Error ? error.message : error,
  timestamp: new Date().toISOString(),
  url: req.url
});
```

### 3. 降级策略
```typescript
// 当截图服务失败时使用默认图片
return NextResponse.json({
  data: {
    title: url,
    description: '暂无描述',
    screenshot: {
      url: 'https://cdn.liboqiao.top/markdown/default.png'
    }
  }
});
```

## 最佳实践建议

1. **错误分类**
   - 区分业务错误和技术错误
   - 提供清晰的错误信息
   - 使用合适的 HTTP 状态码

2. **重试机制**
   - 对网络请求实现重试
   - 使用指数退避策略
   - 设置最大重试次数

3. **超时控制**
   - 设置合理的超时时间
   - 实现请求取消机制
   - 提供超时提示

4. **资源清理**
   - 确保浏览器实例正确关闭
   - 清理临时文件
   - 释放系统资源

5. **监控告警**
   - 记录关键错误信息
   - 实现错误上报机制
   - 设置错误阈值告警

## 常见错误码说明

- 400: 请求参数错误
- 401: 未授权访问
- 403: 禁止访问
- 404: 资源不存在
- 408: 请求超时
- 429: 请求过于频繁
- 500: 服务器内部错误
- 503: 服务暂时不可用

## 调试技巧

1. 使用详细的日志记录
2. 设置断点调试
3. 使用错误追踪工具
4. 模拟各种错误场景
5. 测试错误恢复机制

---

> 注意：这些错误处理策略需要根据具体的业务场景和需求进行调整。 