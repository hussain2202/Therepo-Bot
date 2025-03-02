
{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.python312
    pkgs.ffmpeg
    pkgs.libuuid
    pkgs.cairo
    pkgs.pango
    pkgs.pkg-config
    pkgs.pixman
    pkgs.libpng
  ];
}
