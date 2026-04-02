<script setup lang="ts">
import { computed } from 'vue';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const props = defineProps<{
  launch: any;
}>();

const launchDate = computed(() => {
  return new Date(props.launch.net).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const statusColor = computed(() => {
  switch (props.launch.status?.abbrev) {
    case 'GO':
    case 'Success':
      return 'bg-secondary text-secondary-foreground';
    case 'TBD':
    case 'TBC':
      return 'bg-muted text-muted-foreground';
    case 'Failure':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-primary text-primary-foreground';
  }
});
</script>

<template>
  <Card class="bg-card/70 backdrop-blur-xl border-border/15 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5">
    <CardHeader class="pb-3 border-b border-border/5">
      <div class="flex justify-between items-start">
        <Badge :class="statusColor" class="mb-2 uppercase tracking-wide px-2 py-0.5 font-mono text-xs">
          {{ launch.status?.abbrev || 'Unknown' }}
        </Badge>
      </div>
      <CardTitle class="text-2xl lg:text-3xl font-display font-medium text-foreground tracking-tight leading-tight">
        {{ launch.name }}
      </CardTitle>
      <CardDescription class="text-sm font-mono tracking-wide uppercase text-primary mt-1">
        {{ launch.launch_service_provider?.name }}
      </CardDescription>
    </CardHeader>
    <CardContent class="pt-4 pb-2">
      <div class="space-y-3">
        <div class="flex flex-col">
          <span class="text-xs text-muted-foreground uppercase tracking-widest font-mono">Date (NET)</span>
          <span class="text-foreground tracking-tight">{{ launchDate }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-muted-foreground uppercase tracking-widest font-mono">Rocket</span>
          <span class="text-foreground tracking-tight">{{ launch.rocket?.configuration?.name || 'Unknown' }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-muted-foreground uppercase tracking-widest font-mono">Location</span>
          <span class="text-foreground tracking-tight line-clamp-1">{{ launch.pad?.location?.name || 'Unknown' }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
