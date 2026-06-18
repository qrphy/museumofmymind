on run argv
  if (count of argv) is not 1 then error "Usage: osascript export-photos.applescript <export-directory>"

  set albumName to "museum of my mind"
  set exportDirectory to POSIX file (item 1 of argv) as alias

  tell application "Photos"
    set matchingAlbums to every album whose name is albumName
    if (count of matchingAlbums) is 0 then error "Photos album not found: " & albumName

    set targetAlbum to item 1 of matchingAlbums
    set albumItems to media items of targetAlbum
    if (count of albumItems) is 0 then error "Photos album is empty: " & albumName

    export albumItems to exportDirectory with using originals
    return "Exported " & (count of albumItems) & " items to " & (item 1 of argv)
  end tell
end run
