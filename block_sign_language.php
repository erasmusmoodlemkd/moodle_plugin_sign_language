<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Block for displaying open-dyslexic font on site
 *
 * @package    block_sign_language
 * @copyright  2016 onwards Éric Bugnet {@link http://eric.bugnet.fr/}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @author     Éric Bugnet
 */

defined('MOODLE_INTERNAL') || die();
/**
 * Displays block
 */
class block_sign_language extends block_base {


    public function init() {
        $this->title = get_string('pluginname', 'block_sign_language');
        $this->content_type = BLOCK_TYPE_TEXT;
    }


    public function instance_allow_multiple() {
        return false;
    }

    public function hide_header() {
        return false;
    }

    public function get_content() {
        global $CFG, $COURSE;

        if ($this->content !== null) {
            return $this->content;
        }

        // Include Javascript.
		//$this->page->requires->js('/blocks/sign_language/popup/js/jquery-modal-video.js');
		//$this->page->requires->js('/blocks/sign_language/jquery.tmpl.js');
		//$this->page->requires->css('/blocks/sign_language/popup/css/modal-video.min.css');
		//$this->page->requires->css('/blocks/sign_language/sign_language.css');
        //$this->page->requires->js('/blocks/sign_language/sign_language.js');

        $this->content = new stdClass();

        $this->content->text = get_string("sign_language_intro", "block_sign_language");
		
		if (!isset($_COOKIE["sign_language"]) || $_COOKIE["sign_language"] == "false") {
			$this->content->text .= '<div align="center"><form>
            <input class="btn btn-sm btn-default" type="submit" onclick="setCookie(\'sign_language\', \'true\', 60);return false;" name="theme" value="'.get_string("enable", "block_sign_language").'" id="on">
            </form></div> ';
		} else if ($_COOKIE["sign_language"] == "true") {
			$this->content->text .= '<div align="center"><form>
            <input class="btn btn-sm btn-default" type="submit" onclick="setCookie(\'sign_language\', \'false\', 60);return false;" name="theme" value="'.get_string("disable", "block_sign_language").'" id="on">
            </form></div> ';
		}
		
/*
        
            $this->content->text .= '<div align="center">
			
			<!-- video modal -->
		<section class="video-modal">	

			<!-- Modal Content Wrapper -->
			<div  id="video-modal-content" class="video-modal-content">
			  
			   <!-- iframe -->
			   <iframe 
				  id="youtube" 
				  width="100%" 
				  height="100%" 
				  frameborder="0" 
				  allow="autoplay" 
				  allowfullscreen 
				  src=></iframe>

				<a 
					href="#" 
					class="close-video-modal" 
				>
					<!-- X close video icon -->
				  <svg 
					version="1.1" 
					xmlns="http://www.w3.org/2000/svg" 
					xmlns:xlink="http://www.w3.org/1999/xlink"
					x="0"
					y="0"
					viewBox="0 0 32 32" 
					style="enable-background:new 0 0 32 32;" 
					xml:space="preserve" 
					width="24" 
					height="24" 
				  >

					<g id="icon-x-close">
						<path fill="#ffffff" d="M30.3448276,31.4576271 C29.9059965,31.4572473 29.4852797,31.2855701 29.1751724,30.980339 L0.485517241,2.77694915 C-0.122171278,2.13584324 -0.104240278,1.13679247 0.52607603,0.517159487 C1.15639234,-0.102473494 2.17266813,-0.120100579 2.82482759,0.477288136 L31.5144828,28.680678 C31.9872448,29.1460053 32.1285698,29.8453523 31.8726333,30.4529866 C31.6166968,31.0606209 31.0138299,31.4570487 30.3448276,31.4576271 Z" id="Shape"></path>
						<path fill="#ffffff" d="M1.65517241,31.4576271 C0.986170142,31.4570487 0.383303157,31.0606209 0.127366673,30.4529866 C-0.12856981,29.8453523 0.0127551942,29.1460053 0.485517241,28.680678 L29.1751724,0.477288136 C29.8273319,-0.120100579 30.8436077,-0.102473494 31.473924,0.517159487 C32.1042403,1.13679247 32.1221713,2.13584324 31.5144828,2.77694915 L2.82482759,30.980339 C2.51472031,31.2855701 2.09400353,31.4572473 1.65517241,31.4576271 Z" id="Shape"></path>
					</g>

				  </svg>
				</a>

			</div><!-- end modal content wrapper -->


			<!-- clickable overlay element -->
			<div class="overlay"></div>
					
				<script type="text/javascript" src="/blocks/sign_language/jquery.min.js"></script>
				<script type="text/javascript" src="/blocks/sign_language/sign_language.js"></script>
			
			<form>
			
			
					<input class="btn btn-sm btn-default" type="submit" onclick="setCookie(\'dyslexic\', \'true\', 60);return false;" name="theme" value="'.get_string("opendyslexic_font", "block_sign_language").'" id="on">
					</form></div> ';

        //$url = new moodle_url($CFG->wwwroot.'/blocks/sign_language/view.php', array('blockid' => $this->instance->id, 'courseid' => $COURSE->id));
        //$this->content->footer = html_writer::link($url, get_string("readmore", "block_sign_language"));
		*/
        return $this->content;
    }
}
