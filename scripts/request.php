<?php

	if (!function_exists("slim_send")){ 
		error_reporting(E_ERROR);
		$root="/var/www/html/slimweb";
		include($root."/api/contact/slim_send.php"); 
	}
	
	if($_POST['id'] === "contact-center-form-form") {
	$mailto = "";

	$data_array = json_decode($_POST['data']);
	$message = "";//for email
	$values="";//for gs
	
	$values[]=$_SERVER["HTTP_REFERER"];
	$values[]=$mailto;
	date_default_timezone_set("Asia/Bangkok");
	$values[]=date("m/d/Y h:i:s a", time());

	foreach ($data_array as $key => $value) {
		if (isset($value->name) && $value->name !== "") {
			$message .= $value->name.': '.$value->value.'<br>';
			$values[]=$value->value;
		}
	}


	//save to gs
	slim_save_to_gs([$values]);

	$subject = "[Thông báo] Có liên hệ từ slimweb";

	// a random hash will be necessary to send mixed content
	$separator= "Ngày: ".date("d/m/Y");

	// carriage return type (RFC)
	$eol = "\r\n<br>";

	// main header (multipart mandatory)
	$headers = "From: $mailto" . $eol;
	$headers .= "Reply-To: $mailto" . $eol;
	$headers .= "MIME-Version: 1.0" . $eol;
	$headers .= "Content-Type: multipart/mixed; boundary=\"" . $separator . "\"" . $eol;
	$headers .= "Content-Transfer-Encoding: 7bit" . $eol;
	$headers .= "This is a MIME encoded message." . $eol;

	// message
	$body ="Bạn có liên hệ mới từ Slimweb.vn". $eol;
	$body .= "--" . $separator . $eol;
	$body .= "<div>" . $message . "</div>" . $eol . $eol;

	//attachment file
	// foreach( $_FILES as $file) {
	// 	if ( !move_uploaded_file( $file['tmp_name'], dirname(__FILE__) . '/../tmp/' . $file['name'] ) ) {
	// 		echo "error upload file: " . $file['name'];
	// 		continue;
	// 	}
	// 	$filename = $file['name'];
	// 	$path = dirname(__FILE__) . '/../tmp';
	// 	$file = $path . "/" . $filename;

	// 	$content = file_get_contents($file);
	// 	$content = chunk_split(base64_encode($content));

	// 	// attachment
	// 	$body .= "--" . $separator . $eol;
	// 	$body .= "Content-Type: application/octet-stream; name=\"" . $filename . "\"" . $eol;
	// 	$body .= "Content-Transfer-Encoding: base64" . $eol;
	// 	$body .= "Content-Disposition: attachment" . $eol . $eol;
	// 	$body .= $content . $eol;
	// }
	//end attachment

	$ref_domain = $_SERVER["HTTP_REFERER"];
	$body .= "Địa chỉ website: ".$ref_domain.$eol;

	$body .= "----".$eol;
	$body .= "BỘ BA PHẦN MỀM GIÚP TĂNG TRƯỞNG".$eol;
	$body .= "1 - Tiếp thị email tự động: http://Slimemail.vn".$eol;  
	$body .= "2 - Phần mềm quản trị và bán hàng: http://Slimcrm.vn".$eol;
	$body .= "3 - Tăng số lượng khách hàng: http://Slimads.vn".$eol;
	$body .= "----";
 	$param = ["from" => "info@slimsoft.vn",
		  "fromname" => "SlimSoft.vn",
 		  "to" => $mailto,
 		  "cc"=>"",
 		  "bcc"=>"",
 		  "reply"=>"",
 		  "subject"=>$subject,
 		  "body"=>$body,
 		  "file"=>""];

	//SEND Mail
	if (slim_send($param)) {
		echo "ok"; // or use booleans here
	} else {
		echo "Gửi email không thành công ... ERROR!";
		print_r( error_get_last() );
	}
}