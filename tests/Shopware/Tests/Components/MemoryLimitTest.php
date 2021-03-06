<?php
/**
 * Shopware 5
 * Copyright (c) shopware AG
 *
 * According to our dual licensing model, this program can be used either
 * under the terms of the GNU Affero General Public License, version 3,
 * or under a proprietary license.
 *
 * The texts of the GNU Affero General Public License with an additional
 * permission and of our proprietary license can be found at and
 * in the LICENSE file you have received along with this program.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * "Shopware" is a registered trademark of shopware AG.
 * The licensing of the program under the AGPLv3 does not imply a
 * trademark license. Therefore any rights, title and interest in
 * our trademarks remain entirely with us.
 */

namespace Shopware\Components;

use Shopware\Tests\Components\MemoryMock;

function ini_get($varname)
{
    if ($varname != 'memory_limit') {
        return \ini_get($varname);
    }

    return MemoryMock::getLimit();
}

function ini_set($varname, $value)
{
    if ($varname != 'memory_limit') {
        return \ini_set($varname, $value);
    }

    MemoryMock::setLimit($value);
}

namespace Shopware\Tests\Components;

use Shopware\Components\MemoryLimit;

class MemoryMock
{
    public static $limit;

    public static function setLimit($limit)
    {
        self::$limit = $limit;
    }

    public static function getLimit()
    {
        return self::$limit;
    }
}

class MemoryLimitTest extends \PHPUnit_Framework_TestCase
{
    public function getBytesConversionTestData()
    {
        return array(
            array('2k', 2048),
            array('2 k', 2048),
            array('8m', 8 * 1024 * 1024),
            array('+2 k', 2048),
            array('+2???k', 2048),
            array('0x10', 16),
            array('0xf', 15),
            array('010', 8),
            array('+0x10 k', 16 * 1024),
            array('1g', 1024 * 1024 * 1024),
            array('1G', 1024 * 1024 * 1024),
            array('-1', -1),
            array('0', 0),
            array('2mk', 2048), // the unit must be the last char, so in this case 'k', not 'm'
        );
    }

    /**
     * @dataProvider getBytesConversionTestData
     */
    public function testBytesConversion($limit, $bytes)
    {
        $this->assertEquals($bytes, MemoryLimit::convertToBytes($limit));
    }

    public function testSetMinimuimShouldIncrease()
    {
        MemoryMock::setLimit('15M');

        MemoryLimit::setMinimumMemoryLimit(1024*1024*20);

        $this->assertEquals(1024*1024*20, MemoryMock::getLimit());
    }

    public function testSetMinimuimShouldNotIncrease()
    {
        MemoryMock::setLimit('1G');

        MemoryLimit::setMinimumMemoryLimit(1024*1024*20);

        $this->assertEquals('1G', MemoryMock::getLimit());
    }

    public function testSetMinimuimShouldNotIncreaseUnlimited()
    {
        MemoryMock::setLimit('-1');

        MemoryLimit::setMinimumMemoryLimit(1024*1024*20);

        $this->assertEquals('-1', MemoryMock::getLimit());
    }
}
