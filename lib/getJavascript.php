<?php

Header("content-type: application/x-javascript");

$src = $_GET["script"];

require("class.JavaScriptPacker.php");

$script = file_get_contents($src);/*
$script = str_replace("\\\r\n", "\\n", $script);
$script = str_replace("\\\n", "\\n", $script);
$script = str_replace("\\\r", "\\n", $script);
$script = str_replace("}\r\n", "};\r\n", $script);
$script = str_replace("}\n", "};\n", $script);
$script = str_replace("}\r", "};\r", $script);*/


$packer = new JavaScriptPacker($script, 'Normal', true, false);
$packed = $packer->pack();

echo $script;


?>
