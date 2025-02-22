$files = Get-ChildItem -Path "src\components\ui" -Filter "*.tsx" -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace 'from "../../lib/utils"', 'from "@/lib/utils"'
    Set-Content -Path $file.FullName -Value $newContent
}
