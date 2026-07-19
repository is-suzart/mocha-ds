extern crate napi_build;

use std::path::PathBuf;
use std::process::Command;

fn main() {
    napi_build::setup();

    // Get Qt includes and libs
    let qt_includes = pkg_config("Qt6Core Qt6Gui Qt6Qml Qt6Quick", "--cflags-only-I");
    let qt_libs = pkg_config("Qt6Core Qt6Gui Qt6Qml Qt6Quick", "--libs");

    // Find moc binary
    let moc = find_moc();

    // Generate moc file for qt_bridge.cpp (has Q_OBJECT macro)
    let src_dir = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap()).join("src");
    let moc_out = src_dir.join("qt_bridge.moc");

    let moc_status = Command::new(&moc)
        .args(&qt_include_flags(&qt_includes))
        .arg("-o")
        .arg(&moc_out)
        .arg(src_dir.join("qt_bridge.cpp"))
        .status()
        .expect("moc failed — is Qt6 moc installed?");

    if !moc_status.success() {
        panic!("moc failed — is Qt6 moc installed?");
    }

    // Compile C++ bridge
    cc::Build::new()
        .cpp(true)
        .file("src/qt_bridge.cpp")
        .flag("-std=c++17")
        .flag("-fPIC")
        .includes(&qt_include_dirs(&qt_includes))
        .compile("qt_bridge");

    // Pass Qt libs to the linker
    for lib in qt_libs.split_whitespace() {
        if lib.starts_with("-l") {
            println!("cargo:rustc-link-lib={}", &lib[2..]);
        } else if lib.starts_with("-L") {
            println!("cargo:rustc-link-search=native={}", &lib[2..]);
        }
    }

    // Tell cargo to re-run if the .cpp changes
    println!("cargo:rerun-if-changed=src/qt_bridge.cpp");
}

fn pkg_config(packages: &str, flags: &str) -> String {
    let output = Command::new("pkg-config")
        .args(flags.split_whitespace())
        .args(packages.split_whitespace())
        .output()
        .expect("pkg-config failed - is Qt6 installed?");
    String::from_utf8_lossy(&output.stdout).trim().to_string()
}

fn qt_include_dirs(flags: &str) -> Vec<String> {
    flags
        .split_whitespace()
        .filter_map(|f| {
            if f.starts_with("-I") {
                Some(f[2..].to_string())
            } else {
                None
            }
        })
        .collect()
}

fn qt_include_flags(flags: &str) -> Vec<String> {
    flags
        .split_whitespace()
        .filter_map(|f| {
            if f.starts_with("-I") {
                Some(f.to_string())
            } else {
                None
            }
        })
        .collect()
}

fn find_moc() -> String {
    let candidates = vec![
        "/usr/lib/qt6/moc",
        "moc-qt6",
        "moc",
        "/usr/lib/qt6/libexec/moc",
        "/usr/lib/qt6/bin/moc",
        "/usr/lib/x86_64-linux-gnu/qt6/libexec/moc",
        "/usr/local/opt/qt@6/bin/moc",
    ];

    for cmd in &candidates {
        if Command::new(cmd)
            .arg("--version")
            .output()
            .map(|o| o.status.success())
            .unwrap_or(false)
        {
            return cmd.to_string();
        }
    }

    panic!("moc (Qt6 Meta-Object Compiler) not found. Install qt6-base-dev or qt6-tools-dev.");
}
