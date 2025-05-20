<script lang="ts">
  // SVG path definitions for the filigree border elements
  const svgPaths = {
    corner: "M 3 21.7 C 5.383 14.227 9.646 7.066 18.1 3.2 L 12.2 3.2 L 3 12.8 Z M 6.9 15.7 C 5.088 19.235 3.776 23.004 3 26.9 L 2.999 30 L 0 30 L 0 11.5 L 11 0 L 25 0 L 25 3.1 L 22.4 3.1 C 16.737 4.586 11.822 8.112 8.6 13 L 8.6 30 L 6.9 30 Z",
    block: "M 0 0 L 10 0 L 10 3.1 L 0 3.1 L 0 0 Z",
    inline: "M 0 10 L 0 0 L 2.99 0 L 2.989 10 L 0 10 Z M 6.9 10 L 6.9 0 L 8.6 0 L 8.6 10 L 6.9 10 Z"
  };
  
  // Add prop to accept custom classes
  export let className = '';
</script>

<div class="filigree-card {className}">
  <div class="backdrop"></div>
  
  <!-- Corners -->
  <svg class="filigree corner top left" viewBox="0 0 25 30" preserveAspectRatio="none">
    <path d={svgPaths.corner} />
  </svg>
  <svg class="filigree corner top right" viewBox="0 0 25 30" preserveAspectRatio="none">
    <path d={svgPaths.corner} />
  </svg>
  <svg class="filigree corner bottom left" viewBox="0 0 25 30" preserveAspectRatio="none">
    <path d={svgPaths.corner} />
  </svg>
  <svg class="filigree corner bottom right" viewBox="0 0 25 30" preserveAspectRatio="none">
    <path d={svgPaths.corner} />
  </svg>
  
  <!-- Top and bottom edges -->
  <svg class="filigree block top" viewBox="0 0 10 30" preserveAspectRatio="none">
    <path d={svgPaths.block} />
  </svg>
  <svg class="filigree block bottom" viewBox="0 0 10 30" preserveAspectRatio="none">
    <path d={svgPaths.block} />
  </svg>
  
  <!-- Left and right edges -->
  <svg class="filigree inline left" viewBox="0 0 25 10" preserveAspectRatio="none">
    <path d={svgPaths.inline} />
  </svg>
  <svg class="filigree inline right" viewBox="0 0 25 10" preserveAspectRatio="none">
    <path d={svgPaths.inline} />
  </svg>
  
  <!-- Content -->
  <slot></slot>
</div>

<style>
  .filigree-card {
    background: var(--t5e-component-card-default);
    border-radius: 20px;
    position: relative;
    isolation: isolate;
    min-height: 56px;
    filter: var(--filigree-drop-shadow, drop-shadow(0 0 12px var(--dnd5e-shadow-15)));
  }
  
  .backdrop {
    --chamfer: 12px;
    position: absolute;
    inset: 0;
    z-index: -2;
    clip-path: polygon(
      var(--chamfer) 0,
      calc(100% - var(--chamfer)) 0,
      100% var(--chamfer),
      100% calc(100% - var(--chamfer)),
      calc(100% - var(--chamfer)) 100%,
      var(--chamfer) 100%,
      0 calc(100% - var(--chamfer)),
      0 var(--chamfer)
    );
  }
  
  .filigree {
    position: absolute;
    fill: var(--t5e-color-filigree);
    z-index: -1;
  }
  
  .filigree.top, .filigree.bottom { 
    height: 30px; 
  }
  
  .filigree.top { 
    top: 0; 
  }
  
  .filigree.bottom { 
    bottom: 0; 
    transform: scale(1, -1); 
  }
  
  .filigree.left, .filigree.right { 
    width: 25px; 
  }
  
  .filigree.left { 
    left: 0; 
  }
  
  .filigree.right { 
    right: 0; 
    transform: scale(-1, 1); 
  }
  
  .filigree.bottom.right { 
    transform: scale(-1, -1); 
  }
  
  .filigree.block {
    inline-size: calc(100% - 50px);
    inset-inline: 25px;
  }
  
  .filigree.inline {
    block-size: calc(100% - 60px);
    inset-block: 30px;
  }
</style> 