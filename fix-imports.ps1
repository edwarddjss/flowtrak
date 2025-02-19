$files = Get-ChildItem -Path "src\components\ui" -Filter "*.tsx"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace 'from "@/lib/utils"', 'from "../../lib/utils"'
    $newContent = $newContent -replace 'from "@/components/ui/', 'from "./'
    Set-Content -Path $file.FullName -Value $newContent
}
