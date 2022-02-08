<script lang="ts">
  import { moveable } from '../../lib/Moveable';
</script>

<div  class="
            absolute bottom-8 right-8
            p-4 h-6 w-6 text-xs font-mono select-none
            rounded-full flex items-center justify-center hover:cursor-pointer
            shadow
          text-white bg-gray-700 sm:bg-pink-500 md:bg-orange-500 lg:bg-green-500 xl:bg-blue-500 2xl:bg-indigo-500" 
      use:moveable>
    <div class="block  sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">al</div>
    <div class="hidden sm:block  md:hidden lg:hidden xl:hidden 2xl:hidden">sm</div>
    <div class="hidden sm:hidden md:block  lg:hidden xl:hidden 2xl:hidden">md</div>
    <div class="hidden sm:hidden md:hidden lg:block  xl:hidden 2xl:hidden">lg</div>
    <div class="hidden sm:hidden md:hidden lg:hidden xl:block 2xl:hidden">xl</div>
    <div class="hidden sm:hidden md:hidden lg:hidden xl:hidden 2xl:block">2xl</div>
</div>