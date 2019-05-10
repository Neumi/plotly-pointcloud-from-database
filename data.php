<?php
/**
 * Created by PhpStorm.
 * User: Jan
 * Date: 05.04.19
 * Time: 04:43
 */
include_once('connection.php');

$scanId = 1;

$list = [];
$db = Db::getInstance();
$req = $db->prepare('select x,y,z,point_id from cartesian_pointcloud cp where cp.scan_id = :scan_id');
$req->execute(array('scan_id' => $scanId));

$list = array();
$filename = 'data.csv';

// Append results to array
array_push($list, array_values(array('x', 'y', 'z', 'g')));
while ($row = $req->fetch(PDO::FETCH_ASSOC)) {
    array_push($list, array_values($row));
}

// Output array into CSV file
$fp = fopen('php://output', 'w');
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="' . $filename . '"');
foreach ($list as $ferow) {
    fputcsv($fp, $ferow);
}
