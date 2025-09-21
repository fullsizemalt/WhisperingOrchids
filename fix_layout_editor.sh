#!/bin/bash
# Remove the import line
sed -i '/import { LayoutElement } from "..\/types\/LayoutElement";/d' src/components/LayoutEditor.tsx

# Add export to the LayoutElement interface
sed -i '/^interface LayoutElement {/s/^interface/export interface/' src/components/LayoutEditor.tsx
