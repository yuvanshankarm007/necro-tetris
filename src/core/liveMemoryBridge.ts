/**
 * Defrag84 - Live Memory Bridge & Container Telemetry Provider
 * Connects the 2D bin-packing defragmenter to real browser V8 heap metrics
 * and simulated Kubernetes cloud container workloads.
 */

export interface ContainerProfile {
  id: string;
  name: string;
  category: 'k8s_container' | 'llm_inference' | 'cache_daemon' | 'real_v8_heap';
  description: string;
  podName: string;
  namespace: string;
  baseHeapMb: number;
  maxHeapMb: number;
  primaryAllocation: string;
  fragmentationTendency: 'low' | 'medium' | 'critical';
}

export const CONTAINER_PROFILES: ContainerProfile[] = [
  {
    id: 'k8s-vllm-inference',
    name: 'vLLM Neural Inference Worker',
    category: 'llm_inference',
    description: 'PagedAttention KV-cache transformer context slices with high fragmentation volatility.',
    podName: 'vllm-worker-cuda-0.pod.cluster.local',
    namespace: 'ai-serving',
    baseHeapMb: 18.4,
    maxHeapMb: 25.6,
    primaryAllocation: 'KV_CACHE (160 KB)',
    fragmentationTendency: 'critical',
  },
  {
    id: 'k8s-api-gateway',
    name: 'Envoy Ingress Gateway',
    category: 'k8s_container',
    description: 'High-throughput TCP connection pool and ephemeral JSON document trees.',
    podName: 'envoy-gateway-7b9c9f4d.pod.cluster.local',
    namespace: 'ingress-nginx',
    baseHeapMb: 12.1,
    maxHeapMb: 25.6,
    primaryAllocation: 'SOCK_FD (192 KB)',
    fragmentationTendency: 'medium',
  },
  {
    id: 'k8s-redis-cache',
    name: 'Redis In-Memory Buffer Daemon',
    category: 'cache_daemon',
    description: 'Contiguous I/O buffer blocks with infrequent eviction cycles.',
    podName: 'redis-statefulset-0.pod.cluster.local',
    namespace: 'data-tier',
    baseHeapMb: 15.8,
    maxHeapMb: 25.6,
    primaryAllocation: 'BUF_POOL (256 KB)',
    fragmentationTendency: 'low',
  },
  {
    id: 'real-v8-heap',
    name: 'Live Chromium V8 Heap',
    category: 'real_v8_heap',
    description: 'Direct eBPF-style telemetry sampled from the host browser JavaScript engine.',
    podName: 'host.browser.v8.runtime',
    namespace: 'client-node',
    baseHeapMb: 10.0,
    maxHeapMb: 25.6,
    primaryAllocation: 'DYNAMIC_V8_HEAP',
    fragmentationTendency: 'medium',
  },
];

export interface LiveV8Stats {
  isSupported: boolean;
  usedHeapMb: number;
  totalHeapMb: number;
  heapLimitMb: number;
  allocationVelocityMbSec: number;
  sampleTimestamp: number;
}

export class LiveMemoryBridge {
  private currentProfile: ContainerProfile = CONTAINER_PROFILES[0];
  private lastV8Sample: { used: number; time: number } | null = null;
  private currentVelocityMbSec: number = 0;

  public getProfiles(): ContainerProfile[] {
    return CONTAINER_PROFILES;
  }

  public getActiveProfile(): ContainerProfile {
    return this.currentProfile;
  }

  public setProfile(profileId: string): ContainerProfile {
    const found = CONTAINER_PROFILES.find((p) => p.id === profileId);
    if (found) {
      this.currentProfile = found;
    }
    return this.currentProfile;
  }

  /**
   * Sample real browser V8 heap if running in Chromium/Node
   */
  public sampleRealV8Heap(): LiveV8Stats {
    const perf = typeof window !== 'undefined' ? (window.performance as any) : null;
    const mem = perf?.memory;

    if (mem && mem.usedJSHeapSize) {
      const now = performance.now();
      const usedMb = mem.usedJSHeapSize / (1024 * 1024);
      const totalMb = mem.totalJSHeapSize / (1024 * 1024);
      const limitMb = mem.jsHeapSizeLimit / (1024 * 1024);

      if (this.lastV8Sample) {
        const deltaSec = (now - this.lastV8Sample.time) / 1000;
        if (deltaSec > 0.2) {
          const deltaMb = Math.max(0, usedMb - this.lastV8Sample.used);
          this.currentVelocityMbSec = Number((deltaMb / deltaSec).toFixed(2));
          this.lastV8Sample = { used: usedMb, time: now };
        }
      } else {
        this.lastV8Sample = { used: usedMb, time: now };
      }

      return {
        isSupported: true,
        usedHeapMb: Number(usedMb.toFixed(2)),
        totalHeapMb: Number(totalMb.toFixed(2)),
        heapLimitMb: Number(limitMb.toFixed(2)),
        allocationVelocityMbSec: this.currentVelocityMbSec,
        sampleTimestamp: Date.now(),
      };
    }

    // Fallback for browsers without window.performance.memory (Firefox/Safari)
    return {
      isSupported: false,
      usedHeapMb: Number((this.currentProfile.baseHeapMb + Math.random() * 2).toFixed(2)),
      totalHeapMb: this.currentProfile.maxHeapMb,
      heapLimitMb: 32.0,
      allocationVelocityMbSec: Number((1.2 + Math.random() * 0.8).toFixed(2)),
      sampleTimestamp: Date.now(),
    };
  }
}

export const liveMemoryBridge = new LiveMemoryBridge();
